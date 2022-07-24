class Tracker {
  constructor() {}

  #trackerUrl = "http://localhost:8001/track";

  sync() {
    const tracker = this;
    if (window.prebuffer) {
      window.prebuffer.forEach((t) => tracker.#saveTrack(t));
    }
    setInterval(() => {
      tracker.#sendTracks();
    }, 1000);
    addEventListener("beforeunload", () => this.#sendTracks(true));
  }

  // Изначально решил делать буфер в sessionStorage.
  // Со слушателем ухода метод необязателен, но может вам будет интересно изначальное решение.
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
    if (isExit && buffer.tracks.length > 0) {
      console.log(isExit);
      navigator.sendBeacon(this.#trackerUrl, JSON.stringify(buffer));
      this.#cleanBuffer();
    } else if (buffer.tracks.length >= 3) {
      try {
        const result = await fetch(this.#trackerUrl, {
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

window.tracker = new Tracker();
tracker.sync();
