import Animation from "./libs/animation";
import {Image1} from "./libs/images/image1";
import {Image2} from "./libs/images/image2";
import {Image3} from "./libs/images/image3";

console.log("My generative art.");

// images
const image = new Image1(400, 400);
// const image = new Image2(400, 400);
// const image = new Image3(400, 400);

Animation.getInstance()
  .setImageToPaint(image)
  .start();
