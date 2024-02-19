import Image from "image-js";

self.onmessage = function (e) {
  console.log("Worker received " + e.data);
  if (e.data != null || typeof e !== "undefined") {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      Image.load(event.target.result).then(function (i) {
        console.log("Worker posted " + i.resize({ width: 256 }));
        postMessage(i.resize({ width: 256 }));
      });
    });
    reader.readAsDataURL(e.data);
  }
};
