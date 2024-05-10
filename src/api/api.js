import axios from "axios";
import Cookies from "js-cookies";

export default class api {
  static url = "http://127.0.0.1:3000/api";
  static token = Cookies.getItem("token");
 
}
