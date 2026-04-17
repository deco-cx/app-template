import { AppContext } from "../../mod.ts";

export default function withPassword(props: unknown, ctx: AppContext) {
  if (
    !isObject(props) ||
    !hasActionPassword(props)
  ) {
    throw new Error("Invalid password");
  }

  const { password } = props as { password?: string };

  if (password !== ctx.actionPassword) {
    throw new Error("Invalid password");
  }
}

function isObject(obj: unknown) {
  return typeof obj === "object" && obj !== null;
}

function hasActionPassword(props: object) {
  return ("password" in props) &&
    typeof props?.password === "string" &&
    props?.password !== null;
}
