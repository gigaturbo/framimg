import Image from "image-js";

self.onmessage = (e) => {
  const reader = new FileReader();
  reader.onload = async (er) => {
    const imgjs = await Image.load(er.target.result);
    const image = {
      imagejs: imgjs,
      width: imgjs.width,
      height: imgjs.height,
      dataURL: er.target.result,
      file: e.data,
    };
    self.postMessage(image);
  };
  reader.readAsDataURL(e.data);
};
