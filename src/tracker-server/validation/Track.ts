import { validateOrReject } from "class-validator";
import { SessionBuffer } from "../entities/SessionBuffer";
import { Track } from "../entities/Track";

export const validateAndSanitize = async (body: Partial<SessionBuffer>) => {
  const sessionBuffer = new SessionBuffer();
  sessionBuffer.sessionId = body.sessionId;
  sessionBuffer.tracks = body?.tracks.map((t) => {
    const track = new Track();
    track.event = t.event;
    track.tags = t.tags;
    track.url = t.url;
    track.title = t.title;
    track.ts = new Date(t.ts);
    return track;
  });

  await validateOrReject(sessionBuffer);

  return sessionBuffer;
};
