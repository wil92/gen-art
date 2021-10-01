import Animation from "./libs/animation";
import {Image1} from "./libs/images/image1";

console.log("My generative art.");

// images
const image1 = new Image1(200, 200);

Animation.getInstance()
  .setImageToPaint(image1)
  .start();
