"use client";
import React from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFormRegister,
  FieldErrors,
  Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RollupConfigSchema, RollupConfig } from "@/lib/opSchema"; // adjust the import path as needed

// Import shadCN UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import lucide-react icons
import { Trash2, Plus, Check } from "lucide-react";

/* ===========================================================================
   Reusable Form Field Components
   =========================================================================== */

type InputFieldProps = {
  label: string;
  type?: string;
  registration: ReturnType<UseFormRegister<RollupConfig>>;
  error?: string;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  registration,
  error,
  placeholder,
}) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...registration}
      className={`bg-white ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

type SelectFieldProps = {
  label: string;
  options: { label: string; value: string }[];
  control:  Control<RollupConfig>
  name: string;
  error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
}) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <Controller
      control={control}
      name={name as keyof RollupConfig}
      render={({ field }) => (
        <Select
          onValueChange={field.onChange}
          value={field.value as string}
          defaultValue={field.value as string}
        >
          <SelectTrigger className={`bg-white ${error ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

/* ===========================================================================
   Section Components
   =========================================================================== */

// Settlement Layer Section
type SettlementLayerFormProps = {
  register: UseFormRegister<RollupConfig>;
  control: Control<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

const SettlementLayerForm: React.FC<SettlementLayerFormProps> = ({
  register,
  control,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
      <legend className="px-2 text-lg font-semibold">Settlement Layer</legend>
      <SelectField
        label="Selection"
        options={[
          { label: "ETH Mainnet", value: "ETH Mainnet" },
          { label: "ETH Sepolia", value: "ETH Sepolia" },
          { label: "Custom", value: "Custom" },
        ]}
        control={control}
        name="settlement_layer.selection"
        error={errors.settlement_layer?.selection?.message as string}
      />
      <InputField
        label="Chain ID (required if Custom)"
        registration={register("settlement_layer.chain_id")}
        error={errors.settlement_layer?.chain_id?.message as string}
      />
      <InputField
        label="L1 Block Time (required if Custom)"
        registration={register("settlement_layer.l1_block_time")}
        error={errors.settlement_layer?.l1_block_time?.message as string}
      />
      <InputField
        label="Settlement RPC"
        registration={register("settlement_layer.settlement_rpc")}
        error={errors.settlement_layer?.settlement_rpc?.message as string}
      />
    </fieldset>
  );
};

// Participant Section (each participant)
type ParticipantFormProps = {
  index: number;
  register: UseFormRegister<RollupConfig>;
  control: Control<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
  remove: (index: number) => void;
};

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  index,
  register,
  control,
  errors,
  remove,
}) => {
  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4 bg-white shadow">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Participant {index + 1}</h4>
        <Button variant="destructive" size="sm" onClick={() => remove(index)}>
          <Trash2 className="mr-2 h-4 w-4" /> Remove
        </Button>
      </div>
      <SelectField
        label="Execution Layer Type"
        options={[
          { label: "op-geth", value: "op-geth" },
          { label: "other", value: "other" },
        ]}
        control={control}
        name={`participants.${index}.el_type`}
        error={errors.participants?.[index]?.el_type?.message as string}
      />
      <InputField
        label="Execution Layer Image"
        registration={register(`participants.${index}.el_image` as const)}
        error={errors.participants?.[index]?.el_image?.message as string}
      />
      <SelectField
        label="Consensus Layer Type"
        options={[
          { label: "op-node", value: "op-node" },
          { label: "other", value: "other" },
        ]}
        control={control}
        name={`participants.${index}.cl_type`}
        error={errors.participants?.[index]?.cl_type?.message as string}
      />
      <InputField
        label="Consensus Layer Image"
        registration={register(`participants.${index}.cl_image` as const)}
        error={errors.participants?.[index]?.cl_image?.message as string}
      />
    </div>
  );
};

// Signer Configuration Section
type SignerConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

const SignerConfigForm: React.FC<SignerConfigFormProps> = ({
  register,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        registration={register("signer_config.deployer_private_key")}
        error={errors.signer_config?.deployer_private_key?.message as string}
      />
      <InputField
        label="Batcher Private Key or Signer Endpoint"
        registration={register(
          "signer_config.batcher_private_key_or_signer_endpoint"
        )}
        error={
          errors.signer_config?.batcher_private_key_or_signer_endpoint
            ?.message as string
        }
      />
      <InputField
        label="Sequencer Private Key or Signer Endpoint"
        registration={register(
          "signer_config.sequencer_private_key_or_signer_endpoint"
        )}
        error={
          errors.signer_config?.sequencer_private_key_or_signer_endpoint
            ?.message as string
        }
      />
      <InputField
        label="Proposer Private Key or Signer Endpoint"
        registration={register(
          "signer_config.proposer_private_key_or_signer_endpoint"
        )}
        error={
          errors.signer_config?.proposer_private_key_or_signer_endpoint
            ?.message as string
        }
      />
    </fieldset>
  );
};

// Admin Configuration Section
type AdminConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

const AdminConfigForm: React.FC<AdminConfigFormProps> = ({
  register,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
      <legend className="px-2 text-lg font-semibold">Admin Configuration</legend>
      <InputField
        label="Final System Owner (L1 System Admin)"
        registration={register("admin_config.final_system_owner")}
        error={errors.admin_config?.final_system_owner?.message as string}
      />
      <InputField
        label="Proxy Admin Owner (L2 Proxy Admin)"
        registration={register("admin_config.proxy_admin_owner")}
        error={errors.admin_config?.proxy_admin_owner?.message as string}
      />
    </fieldset>
  );
};

// Chain Configuration Section
type ChainConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

const ChainConfigForm: React.FC<ChainConfigFormProps> = ({ register, errors }) => {
  return (
    <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
      <legend className="px-2 text-lg font-semibold">Chain Configuration</legend>
      <InputField
        label="L2 Chain ID"
        registration={register("chain_config.l2_chain_id")}
        error={errors.chain_config?.l2_chain_id?.message as string}
      />
      <InputField
        label="L2 Block Time"
        registration={register("chain_config.l2_block_time")}
        error={errors.chain_config?.l2_block_time?.message as string}
      />
      <InputField
        label="Proof Maturity Delay Seconds"
        type="number"
        registration={register("chain_config.proof_maturity_delay_seconds", {
          valueAsNumber: true,
        })}
        error={errors.chain_config?.proof_maturity_delay_seconds?.message as string}
      />
      <InputField
        label="Base Fee Vault Recipient"
        registration={register("chain_config.base_fee_vault_recipient")}
        error={errors.chain_config?.base_fee_vault_recipient?.message as string}
      />
      <InputField
        label="L1 Fee Vault Recipient"
        registration={register("chain_config.l1_fee_vault_recipient")}
        error={errors.chain_config?.l1_fee_vault_recipient?.message as string}
      />
      <InputField
        label="Sequencer Fee Vault Recipient"
        registration={register("chain_config.sequencer_fee_vault_recipient")}
        error={errors.chain_config?.sequencer_fee_vault_recipient?.message as string}
      />
      <InputField
        label="Base Fee Vault Withdrawal Network"
        registration={register("chain_config.base_fee_vault_withdrawal_network")}
        error={errors.chain_config?.base_fee_vault_withdrawal_network?.message as string}
      />
      <InputField
        label="L1 Fee Vault Withdrawal Network"
        registration={register("chain_config.l1_fee_vault_withdrawal_network")}
        error={errors.chain_config?.l1_fee_vault_withdrawal_network?.message as string}
      />
      <InputField
        label="Sequencer Fee Vault Withdrawal Network"
        registration={register("chain_config.sequencer_fee_vault_withdrawal_network")}
        error={errors.chain_config?.sequencer_fee_vault_withdrawal_network?.message as string}
      />
    </fieldset>
  );
};

// Gas Configuration Section
type GasConfigFormProps = {
  register: UseFormRegister<RollupConfig>;
  errors: FieldErrors<RollupConfig>;
};

const GasConfigForm: React.FC<GasConfigFormProps> = ({ register, errors }) => {
  return (
    <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
      <legend className="px-2 text-lg font-semibold">Gas Configuration</legend>
      <InputField
        label="L2 Genesis Block Gas Limit"
        type="number"
        registration={register("gas_config.l2_genesis_block_gas_limit", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.l2_genesis_block_gas_limit?.message as string}
      />
      <InputField
        label="EIP 1559 Elasticity"
        type="number"
        registration={register("gas_config.eip1559_elasticity", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_elasticity?.message as string}
      />
      <InputField
        label="EIP 1559 Denominator"
        type="number"
        registration={register("gas_config.eip1559_denominator", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_denominator?.message as string}
      />
      <InputField
        label="EIP 1559 Denominator Canyon"
        type="number"
        registration={register("gas_config.eip1559_denominator_canyon", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.eip1559_denominator_canyon?.message as string}
      />
      <InputField
        label="Gas Price Oracle Base Fee Scalar"
        type="number"
        registration={register("gas_config.gas_price_oracle_base_fee_scalar", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.gas_price_oracle_base_fee_scalar?.message as string}
      />
      <InputField
        label="Gas Price Oracle Blob Base Fee Scalar"
        type="number"
        registration={register("gas_config.gas_price_oracle_blob_base_fee_scalar", {
          valueAsNumber: true,
        })}
        error={errors.gas_config?.gas_price_oracle_blob_base_fee_scalar?.message as string}
      />
    </fieldset>
  );
};

/* ===========================================================================
   Main RollupConfigForm Component
   =========================================================================== */

const defaultValues: RollupConfig = {
  rollup_name: "",
  settlement_layer: {
    selection: "ETH Mainnet",
    chain_id: "",
    l1_block_time: "",
    settlement_rpc: "",
  },
  participants: [
    {
      el_type: "op-geth",
      el_image: "op-geth:latest",
      cl_type: "op-node",
      cl_image: "op-node:latest",
    },
  ],
  signer_config: {
    deployer_private_key: "",
    batcher_private_key_or_signer_endpoint: "",
    sequencer_private_key_or_signer_endpoint: "",
    proposer_private_key_or_signer_endpoint: "",
  },
  admin_config: {
    final_system_owner: "",
    proxy_admin_owner: "",
  },
  chain_config: {
    l2_chain_id: "",
    l2_block_time: "2s",
    proof_maturity_delay_seconds: 0,
    base_fee_vault_recipient: "",
    l1_fee_vault_recipient: "",
    sequencer_fee_vault_recipient: "",
    base_fee_vault_withdrawal_network: "",
    l1_fee_vault_withdrawal_network: "",
    sequencer_fee_vault_withdrawal_network: "",
  },
  gas_config: {
    l2_genesis_block_gas_limit: 0,
    eip1559_elasticity: 0,
    eip1559_denominator: 0,
    eip1559_denominator_canyon: 0,
    gas_price_oracle_base_fee_scalar: 0,
    gas_price_oracle_blob_base_fee_scalar: 0,
  },
};

export const RollupConfigForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RollupConfig>({
    resolver: zodResolver(RollupConfigSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = (data: RollupConfig) => {
    console.log("Rollup Config:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow rounded-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Rollup Name"
          registration={register("rollup_name")}
          error={errors.rollup_name?.message as string}
        />

        <SettlementLayerForm
          register={register}
          control={control}
          errors={errors}
        />

        <fieldset className="border border-gray-300 p-4 rounded-md mb-6">
          <legend className="px-2 text-lg font-semibold">Participants</legend>
          {fields.map((field, index) => (
            <ParticipantForm
              key={field.id}
              index={index}
              register={register}
              control={control}
              errors={errors}
              remove={remove}
            />
          ))}
          <Button
            type="button"
            onClick={() =>
              append({
                el_type: "op-geth",
                el_image: "op-geth:latest",
                cl_type: "op-node",
                cl_image: "op-node:latest",
              })
            }
            className="mt-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Participant
          </Button>
        </fieldset>

        <SignerConfigForm register={register} errors={errors} />

        <AdminConfigForm register={register} errors={errors} />

        <ChainConfigForm register={register} errors={errors} />

        <GasConfigForm register={register} errors={errors} />

        <Button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          <Check className="mr-2 h-4 w-4" /> Submit Configuration
        </Button>
      </form>
    </div>
  );
};

export default RollupConfigForm;
