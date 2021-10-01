import Animation from "./libs/animation";
import {Image1} from "./libs/images/image1";
import {Image2} from "./libs/images/image2";

console.log("My generative art.");

// images
// const image = new Image1(200, 200);
const image = new Image2(400, 400);

Animation.getInstance()
  .setImageToPaint(image)
  .start();
