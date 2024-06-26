import { createDid } from "../../lib/did.js";
import { createId } from "../../lib/db.js";

export function createCalendar(server, { api: { authVerifier } }) {
  server.endpoint({
    auth: authVerifier.accessUser,
    handler: async (ctx) => {
      const { input, db, user } = ctx;
      // check if handle exists if its not private
      if (input.visibility !== "private") {
        const handleFound = await ctx.api.objectGet(ctx, input.handle);
        if (handleFound) {
          return { error: "HandleNotAvailable" };
        }
        const domain = input.handle.split(".").slice(1).join(".").toLowerCase();
        // check if its available domain on this instance
        if (!ctx.api.config.availableUserDomains.includes("." + domain)) {
          return { error: "UnsupportedDomain" };
        }
      } else if (input.handle) {
        return { error: "PrivateCannotHaveHandle" };
      }

      // update blobs
      let avatarBlob, headerBlob;
      if (input.avatarBlob) {
        const blob = await db.blobs.findOne({ cid: input.avatarBlob.$cid });
        if (!blob) {
          return { error: "InvalidAvatarBlob" };
        }
        avatarBlob = blob.cid;
      }
      if (input.headerBlob) {
        const blob = await db.blobs.findOne({ cid: input.headerBlob.$cid });
        if (!blob) {
          return { error: "InvalidAvatarBlob" };
        }
        headerBlob = blob.cid;
      }

      // setup initial managers
      const managers = [{ ref: user.did, t: new Date() }];

      // get Id
      const id = createId();

      // get DID
      const didData = await createDid(input.handle || id, ctx);

      // construct calendar
      const calendar = db.calendars.create({
        id,
        ...didData,
        handle: input.handle,
        visibility: input.visibility,
        config: {
          name: input.name,
          description: input.description,
          avatarBlob,
          headerBlob,
        },
        managers,
      });
      await db.em.persist(calendar).flush();

      return {
        body: await calendar.view(ctx),
      };
    },
  });
}

export function getUserCalendars(server, { api: { authVerifier } }) {
  server.endpoint({
    auth: authVerifier.accessUser,
    handler: async (ctx) => {
      const { db, user } = ctx;

      // subscribed calendars
      const subs = await db.subscribes.find({ authorDid: user.did });
      const subsCals = await db.calendars.find({
        did: { $in: subs.map((s) => s.calendarDid) },
      });
      const subscribed = await Promise.all(subsCals.map((c) => c.view(ctx)));
      // owned calendars
      const ownLocal = await ctx.db.calendars.find({
        managersArray: { $in: [ctx.user.did] },
      });
      const owned = await Promise.all(
        ownLocal.map((c) => {
          return c.view(ctx, { events: false });
        }),
      );

      return {
        body: {
          subscribed,
          owned,
        },
      };
    },
  });
}

export function getConcepts(server) {
  server.endpoint(async (ctx) => {
    const { did } = ctx.input;
    const calendar = await ctx.db.calendars.findOne({ did });
    const concepts = await ctx.db.concepts.find({ calendarDid: calendar.did });
    return {
      body: {
        concepts: await Promise.all(
          concepts.map((i) => i.view(ctx, { calendar })),
        ),
      },
    };
  });
}

async function toggleSubscribe(ctx, isRemove = false) {
  const {
    db,
    input: { did },
    user,
  } = ctx;
  const cal = await db.calendars.findOne({ did });
  if (!cal) {
    return { error: "CalendarNotFound " };
  }

  const subBase = {
    calendarDid: did,
    authorDid: user.did,
  };
  let subscribe = await db.subscribes.findOne(subBase);

  if (isRemove) {
    if (!subscribe) {
      return { error: "SubscriptionNotFound" };
    }
    await db.em.remove(subscribe).flush();
    subscribe = undefined;
  } else if (!subscribe) {
    subscribe = db.subscribes.create(subBase);
    await db.em.persist(subscribe).flush();
  }

  return {
    body: {
      ok: true,
      subscribe: subscribe && db.wrap(subscribe).toJSON(),
      calendar: await cal.view(ctx),
    },
  };
}

export function subscribeCalendar(server, { api: { authVerifier } }) {
  server.endpoint({
    auth: authVerifier.accessUser,
    handler: async (ctx) => toggleSubscribe(ctx),
  });
}

export function unsubscribeCalendar(server, { api: { authVerifier } }) {
  server.endpoint({
    auth: authVerifier.accessUser,
    handler: async (ctx) => toggleSubscribe(ctx, true),
  });
}
