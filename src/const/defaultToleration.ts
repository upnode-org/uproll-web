import { Toleration } from "@/lib/configSchema";

const defaultToleration: Toleration = {
  key: "node-role.kubernetes.io/not-ready",
  operator: "EXISTS",
  effect: "NO_EXECUTE",
  value: "",
  toleration_seconds: 300,
};

export default defaultToleration;