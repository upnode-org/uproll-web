/*
  Warnings:

  - You are about to drop the column `globalLogLevel` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `globalNodeSelectors` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `persistent` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the `AltdaDeployConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BatcherParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChallengerParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DaServerParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GrafanaParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MevParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Observability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpContractDeployer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrometheusParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProposerParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupervisorParams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Toleration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `config` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AltdaDeployConfig" DROP CONSTRAINT "AltdaDeployConfig_ConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "BatcherParams" DROP CONSTRAINT "BatcherParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "Chain" DROP CONSTRAINT "Chain_ConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "ChallengerParams" DROP CONSTRAINT "ChallengerParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "DaServerParams" DROP CONSTRAINT "DaServerParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "GrafanaParams" DROP CONSTRAINT "GrafanaParams_observabilityId_fkey";

-- DropForeignKey
ALTER TABLE "Interop" DROP CONSTRAINT "Interop_ConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "MevParams" DROP CONSTRAINT "MevParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkParams" DROP CONSTRAINT "NetworkParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "Observability" DROP CONSTRAINT "Observability_ConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "OpContractDeployer" DROP CONSTRAINT "OpContractDeployer_ConfigurationId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_chainId_fkey";

-- DropForeignKey
ALTER TABLE "PrometheusParams" DROP CONSTRAINT "PrometheusParams_observabilityId_fkey";

-- DropForeignKey
ALTER TABLE "ProposerParams" DROP CONSTRAINT "ProposerParams_chainId_fkey";

-- DropForeignKey
ALTER TABLE "SupervisorParams" DROP CONSTRAINT "SupervisorParams_interopId_fkey";

-- DropForeignKey
ALTER TABLE "Toleration" DROP CONSTRAINT "Toleration_clParticipantId_fkey";

-- DropForeignKey
ALTER TABLE "Toleration" DROP CONSTRAINT "Toleration_configurationId_fkey";

-- DropForeignKey
ALTER TABLE "Toleration" DROP CONSTRAINT "Toleration_elParticipantId_fkey";

-- DropForeignKey
ALTER TABLE "Toleration" DROP CONSTRAINT "Toleration_participantId_fkey";

-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "globalLogLevel",
DROP COLUMN "globalNodeSelectors",
DROP COLUMN "persistent",
ADD COLUMN     "config" JSONB NOT NULL;

-- DropTable
DROP TABLE "AltdaDeployConfig";

-- DropTable
DROP TABLE "BatcherParams";

-- DropTable
DROP TABLE "Chain";

-- DropTable
DROP TABLE "ChallengerParams";

-- DropTable
DROP TABLE "DaServerParams";

-- DropTable
DROP TABLE "GrafanaParams";

-- DropTable
DROP TABLE "Interop";

-- DropTable
DROP TABLE "MevParams";

-- DropTable
DROP TABLE "NetworkParams";

-- DropTable
DROP TABLE "Observability";

-- DropTable
DROP TABLE "OpContractDeployer";

-- DropTable
DROP TABLE "Participant";

-- DropTable
DROP TABLE "PrometheusParams";

-- DropTable
DROP TABLE "ProposerParams";

-- DropTable
DROP TABLE "SupervisorParams";

-- DropTable
DROP TABLE "Toleration";

-- DropEnum
DROP TYPE "AdditionalService";

-- DropEnum
DROP TYPE "ClBuilderType";

-- DropEnum
DROP TYPE "ClType";

-- DropEnum
DROP TYPE "ElBuilderType";

-- DropEnum
DROP TYPE "ElType";

-- DropEnum
DROP TYPE "LogLevel";

-- DropEnum
DROP TYPE "TolerationEffect";

-- DropEnum
DROP TYPE "TolerationOperator";
