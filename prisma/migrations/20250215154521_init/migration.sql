/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "globalLogLevel" TEXT NOT NULL,
    "globalNodeSelectors" JSONB,
    "globalTolerations" JSONB,
    "persistent" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observability" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "ConfigurationId" TEXT NOT NULL,

    CONSTRAINT "Observability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrometheusParams" (
    "id" TEXT NOT NULL,
    "storageTsdbRetentionTime" TEXT NOT NULL,
    "storageTsdbRetentionSize" TEXT NOT NULL,
    "minCpu" INTEGER NOT NULL,
    "maxCpu" INTEGER NOT NULL,
    "minMem" INTEGER NOT NULL,
    "maxMem" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "observabilityId" TEXT NOT NULL,

    CONSTRAINT "PrometheusParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrafanaParams" (
    "id" TEXT NOT NULL,
    "dashboardSources" JSONB,
    "minCpu" INTEGER NOT NULL,
    "maxCpu" INTEGER NOT NULL,
    "minMem" INTEGER NOT NULL,
    "maxMem" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "observabilityId" TEXT NOT NULL,

    CONSTRAINT "GrafanaParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interop" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "ConfigurationId" TEXT NOT NULL,

    CONSTRAINT "Interop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupervisorParams" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "dependencySet" TEXT,
    "extraParams" JSONB,
    "interopId" TEXT NOT NULL,

    CONSTRAINT "SupervisorParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AltdaDeployConfig" (
    "id" TEXT NOT NULL,
    "useAltda" BOOLEAN NOT NULL,
    "daCommitmentType" TEXT NOT NULL,
    "daChallengeWindow" INTEGER NOT NULL,
    "daResolveWindow" INTEGER NOT NULL,
    "daBondSize" INTEGER NOT NULL,
    "daResolverRefundPercentage" INTEGER NOT NULL,
    "ConfigurationId" TEXT NOT NULL,

    CONSTRAINT "AltdaDeployConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" TEXT NOT NULL,
    "additionalServices" JSONB,
    "ConfigurationId" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "elType" TEXT NOT NULL,
    "elImage" TEXT,
    "elLogLevel" TEXT,
    "elExtraEnvVars" JSONB,
    "elExtraLabels" JSONB,
    "elExtraParams" JSONB,
    "elTolerations" JSONB,
    "elVolumeSize" INTEGER NOT NULL,
    "elMinCpu" INTEGER NOT NULL,
    "elMaxCpu" INTEGER NOT NULL,
    "elMinMem" INTEGER NOT NULL,
    "elMaxMem" INTEGER NOT NULL,
    "clType" TEXT NOT NULL,
    "clImage" TEXT,
    "clLogLevel" TEXT,
    "clExtraEnvVars" JSONB,
    "clExtraLabels" JSONB,
    "clExtraParams" JSONB,
    "clTolerations" JSONB,
    "clVolumeSize" INTEGER NOT NULL,
    "clMinCpu" INTEGER NOT NULL,
    "clMaxCpu" INTEGER NOT NULL,
    "clMinMem" INTEGER NOT NULL,
    "clMaxMem" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkParams" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "secondsPerSlot" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fjordTimeOffset" INTEGER,
    "graniteTimeOffset" INTEGER,
    "holoceneTimeOffset" INTEGER,
    "isthmusTimeOffset" INTEGER,
    "interopTimeOffset" INTEGER,
    "fundDevAccounts" BOOLEAN NOT NULL,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "NetworkParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatcherParams" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "extraParams" JSONB,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "BatcherParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengerParams" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "extraParams" JSONB,
    "cannonPrestatesPath" TEXT,
    "cannonPrestatesUrl" TEXT,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "ChallengerParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposerParams" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "extraParams" JSONB,
    "gameType" INTEGER NOT NULL,
    "proposalInternal" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "ProposerParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MevParams" (
    "id" TEXT NOT NULL,
    "rollupBoostImage" TEXT,
    "builderHost" TEXT,
    "builderPort" TEXT,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "MevParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaServerParams" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cmd" JSONB,
    "chainId" TEXT NOT NULL,

    CONSTRAINT "DaServerParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpContractDeployer" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "l1ArtifactsLocator" TEXT NOT NULL,
    "l2ArtifactsLocator" TEXT NOT NULL,
    "ConfigurationId" TEXT NOT NULL,

    CONSTRAINT "OpContractDeployer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Observability_ConfigurationId_key" ON "Observability"("ConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "PrometheusParams_observabilityId_key" ON "PrometheusParams"("observabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "GrafanaParams_observabilityId_key" ON "GrafanaParams"("observabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Interop_ConfigurationId_key" ON "Interop"("ConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "SupervisorParams_interopId_key" ON "SupervisorParams"("interopId");

-- CreateIndex
CREATE UNIQUE INDEX "AltdaDeployConfig_ConfigurationId_key" ON "AltdaDeployConfig"("ConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkParams_chainId_key" ON "NetworkParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "BatcherParams_chainId_key" ON "BatcherParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengerParams_chainId_key" ON "ChallengerParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "ProposerParams_chainId_key" ON "ProposerParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "MevParams_chainId_key" ON "MevParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "DaServerParams_chainId_key" ON "DaServerParams"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "OpContractDeployer_ConfigurationId_key" ON "OpContractDeployer"("ConfigurationId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observability" ADD CONSTRAINT "Observability_ConfigurationId_fkey" FOREIGN KEY ("ConfigurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrometheusParams" ADD CONSTRAINT "PrometheusParams_observabilityId_fkey" FOREIGN KEY ("observabilityId") REFERENCES "Observability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrafanaParams" ADD CONSTRAINT "GrafanaParams_observabilityId_fkey" FOREIGN KEY ("observabilityId") REFERENCES "Observability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interop" ADD CONSTRAINT "Interop_ConfigurationId_fkey" FOREIGN KEY ("ConfigurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupervisorParams" ADD CONSTRAINT "SupervisorParams_interopId_fkey" FOREIGN KEY ("interopId") REFERENCES "Interop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AltdaDeployConfig" ADD CONSTRAINT "AltdaDeployConfig_ConfigurationId_fkey" FOREIGN KEY ("ConfigurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chain" ADD CONSTRAINT "Chain_ConfigurationId_fkey" FOREIGN KEY ("ConfigurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkParams" ADD CONSTRAINT "NetworkParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatcherParams" ADD CONSTRAINT "BatcherParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengerParams" ADD CONSTRAINT "ChallengerParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposerParams" ADD CONSTRAINT "ProposerParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MevParams" ADD CONSTRAINT "MevParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaServerParams" ADD CONSTRAINT "DaServerParams_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpContractDeployer" ADD CONSTRAINT "OpContractDeployer_ConfigurationId_fkey" FOREIGN KEY ("ConfigurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
