import Cookies from "js-cookie";

export function setPersist<T = any>(key: string, data: T) {
  try {
    Cookies.set(key, JSON.stringify(data), {
      path: "/",
      sameSite: "lax",
      secure: true,
      expires: 365, // 1 year
    });
  } catch (err) {
    console.error(`setPersist error for key=${key}`, err);
  }
}
