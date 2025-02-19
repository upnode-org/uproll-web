import { ConfigurationDetailResponse } from "@/services/server/configuration";

export const defaultConfig: ConfigurationDetailResponse = {
  // Server generated fields
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: null,
  userId: null,
  id: "",

  // User generated fields
  name: "Sample Config",
  description: "Sample Config Description",
  globalLogLevel: "INFO",
  globalNodeSelectors: {},
  persistent: false,
  globalTolerations: [],
  observability: {
    enabled: true,
    id: "",
    ConfigurationId: "",
    prometheusParams: {
      storageTsdbRetentionTime: "1d",
      storageTsdbRetentionSize: "512MB",
      minCpu: 100,
      maxCpu: 200,
      minMem: 256,
      maxMem: 512,
      image: "prom-image:latest",
      id: "",
      observabilityId: "",
    },
    grafanaParams: {
      dashboardSources: [],
      minCpu: 50,
      maxCpu: 100,
      minMem: 128,
      maxMem: 256,
      image: "grafana-image:latest",
      id: "",
      observabilityId: "",
    },
  },
  interop: {
    id: "",
    enabled: false,
    ConfigurationId: "",
    supervisorParams: {
      image: "",
      dependencySet: "",
      extraParams: {},
      id: "",
      interopId: "",
    },
  },
  altdaDeployConfig: {
    useAltda: false,
    daCommitmentType: "",
    daChallengeWindow: 0,
    daResolveWindow: 0,
    daBondSize: 0,
    daResolverRefundPercentage: 0,
    id: "",
    ConfigurationId: "",
  },
  chains: [
  ],
  opContractDeployer: {
    image: "example-image:latest",
    l1ArtifactsLocator: "",
    l2ArtifactsLocator: "",
    id: "",
    ConfigurationId: "",
  },
};
