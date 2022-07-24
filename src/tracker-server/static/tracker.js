class Tracker {
  constructor() {}

  sync() {
    const tracker = this;
    setInterval(() => {
      tracker.#sendTracks();
    }, 1000);
  }

  #getBuffer() {
    const bufferString = sessionStorage.getItem("buffer");
    return bufferString
      ? JSON.parse(bufferString)
      : { sessionId: Date.now(), tracks: [] };
  }

  #setBuffer(buffer) {
    const bufferString = JSON.stringify(buffer);
    sessionStorage.setItem("buffer", bufferString);
  }

  #cleanBuffer() {
    const buffer = this.#getBuffer();
    buffer.tracks = [];
    this.#setBuffer(buffer);
  }

  #saveTrack(track) {
    const buffer = this.#getBuffer();
    buffer.tracks.push(track);
    this.#setBuffer(buffer);
  }

  async #sendTracks(isExit) {
    const buffer = this.#getBuffer();
    if (buffer.tracks.length > 3 || isExit) {
      try {
        const result = await fetch("http://localhost:8001/track", {
          method: "POST",
          "Content-Type": "application/json; charset=utf-8",
          body: JSON.stringify(buffer),
        });

        if (result.status === 200) this.#cleanBuffer();
      } catch (error) {
        console.warn(`Couldn't send tracking data`);
      }
    }
  }

  track(event, ...tags) {
    this.#saveTrack({
      event,
      tags,
      url: document.location.href,
      title: document.title,
      ts: new Date(),
    });
  }
}

const tracker = new Tracker();
tracker.sync();