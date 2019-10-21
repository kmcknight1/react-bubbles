import axios from "axios";

export function axiosWithAuth() {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: token
    }
  });
}

export function handleChange(e, set) {
  let value = e.target.value;
  set(value.replace(/ /g, ""));
}

export function reset(values, setters) {
  values.map((value, index) => {
    if (typeof value === "number") {
      setters[index](0);
    } else if (typeof value === "string") {
      setters[index]("");
    } else if (typeof value === "boolean") {
      setters[index](false);
    }
  });
}
