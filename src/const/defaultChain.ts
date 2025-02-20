import { Chain } from "@/lib/configSchema";

const defaultChain: Required<Chain> = {
    network_params: {
        network: "",
        network_id: "",
        seconds_per_slot: 0,
        name: "",
        fjord_time_offset: 0,
        granite_time_offset: 0,
        holocene_time_offset: "",
        isthmus_time_offset: "",
        interop_time_offset: "",
        fund_dev_accounts: false,
    },
    participants: [],
    batcher_params: {
        image: "",
        extra_params: [],
    },
    challenger_params: {
        image: "",
        extra_params: [],
        enabled: false,
        cannon_prestates_path: "",
        cannon_prestates_url: "",
    },
    proposer_params: {
        image: "",
        extra_params: [],
        game_type: 0,
        proposal_internal: "",
    },
    mev_params: {
        rollup_boost_image: "",
        builder_host: "",
        builder_port: "",
    },
    additional_services: [],
    da_server_params: {
        image: "",
        cmd: [],
    },
};

export default defaultChain;