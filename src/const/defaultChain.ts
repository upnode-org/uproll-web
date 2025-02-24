import { Chain } from "@/lib/configSchema";

const defaultChain: Required<Chain> = {
  network_params: {
    network: "devnet",
    network_id: "1",
    seconds_per_slot: 2,
    name: "op-devnet",
    fjord_time_offset: 0,
    granite_time_offset: 0,
    holocene_time_offset: "",
    isthmus_time_offset: "",
    interop_time_offset: "",
    fund_dev_accounts: true,
  },
  participants: [],
  batcher_params: {
    image: "",
    extra_params: [] as Array<{ value: string }>,
  },
  challenger_params: {
    enabled: true,
    image: "",
    extra_params: [] as Array<{ value: string }>,
    cannon_prestates_path: "static_files/prestates",
    cannon_prestates_url: "",
  },
  proposer_params: {
    image: "",
    extra_params: [] as Array<{ value: string }>,
    game_type: 1,
    proposal_internal: "10m",
  },
  mev_params: {
    rollup_boost_image: "",
    builder_host: "",
    builder_port: "",
  },
  additional_services: [] as Array<{ value: string }> ,
  da_server_params: {
    image: "us-docker.pkg.dev/oplabs-tools-artifacts/images/da-server:latest",
    cmd: [
      { value: "da-server" },
      { value: "--file.path=/home" },
      { value: "--addr=0.0.0.0" },
      { value: "--port=3100" },
      { value: "--log.level=debug" },
    ],
  },
};

export default defaultChain;