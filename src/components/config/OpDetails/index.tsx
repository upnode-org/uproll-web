"use client";
import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  useController,
  useWatch,
  UseFormRegister,
  FieldErrors,
  Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RollupConfigSchema, RollupConfig } from "@/lib/opSchema";
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

import { Trash2, Plus, Edit3, Save, Download } from "lucide-react";
import HeroWrapper from "@/components/HeroWrapper";
import AnimatedBackground from "@/components/GradientBackground";
import CommandCopy from "@/components/CommandCopy";
import ModalAlert from "@/components/delete/Alert";
import Image from "next/image";

/* ===========================================================================
   Reusable Error Message Component
   =========================================================================== */
interface ErrorMessageProps {
  id: string;
  error?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ id, error }) => {
  if (!error) return null;
  return (
    <p id={id} className="text-xs text-red-500" role="alert">
      {error}
    </p>
  );
};

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
}) => {
  // Using the registration name to build an ID for error feedback.
  const errorId = `${registration.name}-error`;
  return (
    <div className="space-y-1 mt-2">
      <Label
        htmlFor={registration.name as string}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={registration.name as string}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`bg-white rounded-md ${error ? "border-red-500" : ""}`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
      />
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};

type EditableInputFieldProps = {
  label?: string;
  control: Control<RollupConfig>;
  name: keyof RollupConfig;
  error?: string;
};

const EditableInputField: React.FC<EditableInputFieldProps> = ({
  label,
  control,
  name,
  error,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    field: { value, onChange, onBlur, ref, name: fieldName },
  } = useController({
    name,
    control,
  });

  // Create a ref to directly reference the input element.
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine the react-hook-form ref with our own ref.
  const setRefs = (instance: HTMLInputElement | null) => {
    if (typeof ref === "function") {
      ref(instance);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current =
        instance;
    }
    inputRef.current = instance;
  };

  // When editing mode is enabled, focus the input.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const errorId = `${fieldName}-error`;

  return (
    <div className="space-y-1 font-light text-4xl">
      {label && (
        <Label
          htmlFor={fieldName as string}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </Label>
      )}
      {isEditing ? (
        <div className="flex items-end bg-transparent gap-3">
          <input
            id={fieldName as string}
            type="text"
            value={value as string}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              onBlur();
              setIsEditing(false);
            }}
            ref={setRefs}
            autoFocus
            className={`bg-transparent text-white text-4xl py-1 px-2 font-light border w-full overflow-visible text-ellipsis ${
              error ? "border-red-500" : ""
            }`}
            style={{ width: "100%", minWidth: "0", textOverflow: "unset" }}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
          />
        </div>
      ) : (
        <div className="flex items-end bg-transparent py-1 px-2 gap-2 border border-transparent">
          <span className="text-white">{value as string}</span>
          <div
            className="cursor-pointer rounded-full align-bottom p-1 aspect-square hover:bg-gray-50 text-white hover:text-black mb-1"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="size-4" />
          </div>
        </div>
      )}
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};

type SquareButtonSelectorProps = {
  label: string;
  options: { label: string; value: string; image?: string; bg?: string }[];
  control: Control<RollupConfig>;
  name: string;
  error?: string;
};

const SquareButtonSelector: React.FC<SquareButtonSelectorProps> = ({
  label,
  options,
  control,
  name,
  error,
}) => {
  const errorId = `${name}-error`;
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Controller
        control={control}
        name={name as keyof RollupConfig}
        render={({ field }) => (
          <div
            className="grid grid-cols-3 gap-4"
            role="radiogroup"
            aria-describedby={error ? errorId : undefined}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => field.onChange(option.value)}
                className={`
                flex flex-col items-center justify-center border rounded
                aspect-square w-full transition-all max-w-sm mx-auto overflow-visible
                ${
                  field.value === option.value
                    ? "border-blue-500 bg-blue-200"
                    : "border-gray-300 bg-white"
                }
              `}
                aria-pressed={field.value === option.value}
              >
                {option.image ? (
                  <Image
                    width={100}
                    height={100}
                    src={option.image}
                    alt={option.label}
                    className={`w-1/2 h-1/2 object-contain rounded-full p-5 overflow-visible ${
                      option.bg ? option.bg : ""
                    }`}
                  />
                ) : (
                  <div className="w-1/2 h-1/2 bg-gray-200 flex items-center justify-center">
                    <span>Img</span>
                  </div>
                )}
                <span className="mt-2 text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      />
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  options: { label: string; value: string }[];
  control: Control<RollupConfig>;
  name: string;
  error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  control,
  name,
  error,
}) => {
  const errorId = `${name}-error`;
  return (
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
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
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
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};

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
  // Watch the settlement_layer.selection value.
  const selectedNetwork = useWatch({
    control,
    name: "settlement_layer.selection",
  });

  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Settlement Layer</legend>
      <SquareButtonSelector
        label="Selection"
        options={[
          {
            label: "Etheruem Mainnet",
            value: "ETH Mainnet",
            image: "/pngkey.com-ethereum-png-2645391.png",
            bg: "bg-[#647AEF]",
          },
          {
            label: "Etheruem Sepolia",
            value: "ETH Sepolia",
            image: "/eth-sepolia.png",
            bg: "bg-white",
          },
          {
            label: "Custom Network",
            value: "Custom",
            image: "/custom.png",
            bg: "bg-white",
          },
        ]}
        control={control}
        name="settlement_layer.selection"
        error={errors.settlement_layer?.selection?.message as string}
      />
      {selectedNetwork === "Custom" && (
        <>
          <InputField
            label="Chain ID"
            registration={register("settlement_layer.chain_id")}
            error={errors.settlement_layer?.chain_id?.message as string}
          />
          <InputField
            label="L1 Block Time"
            registration={register("settlement_layer.l1_block_time")}
            error={errors.settlement_layer?.l1_block_time?.message as string}
          />
        </>
      )}
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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Participant {index + 1}</h4>
        <Button variant="destructive" size="sm" onClick={() => remove(index)}>
          <Trash2 className="h-4 w-4" /> Remove
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
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
      <legend className="px-2 text-lg font-semibold">Signer Configuration</legend>
      <InputField
        label="Deployer Private Key"
        registration={register("signer_config.deployer_private_key")}
        error={errors.signer_config?.deployer_private_key?.message as string}
      />
      <InputField
        label="Batcher Private Key or Signer Endpoint"
        registration={register("signer_config.batcher_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.batcher_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Sequencer Private Key or Signer Endpoint"
        registration={register("signer_config.sequencer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.sequencer_private_key_or_signer_endpoint?.message as string
        }
      />
      <InputField
        label="Proposer Private Key or Signer Endpoint"
        registration={register("signer_config.proposer_private_key_or_signer_endpoint")}
        error={
          errors.signer_config?.proposer_private_key_or_signer_endpoint?.message as string
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
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
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

const ChainConfigForm: React.FC<ChainConfigFormProps> = ({
  register,
  errors,
}) => {
  return (
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
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
    <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
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
  rollup_name: "Untitled Configuration",
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <HeroWrapper
        backgroundElement={
          <AnimatedBackground className="absolute inset-0 h-full w-full" />
        }
      >
        <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-3">
          <EditableInputField
            // label="Rollup Name"
            control={control}
            name="rollup_name"
            error={errors.rollup_name?.message as string}
          />
          <div className="flex justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Button>
                <Save className="w-4 h-4" /> {true ? "Save" : "Create"}
              </Button>
              <Button>
                <Download className="w-4 h-4" /> Download
              </Button>
              <CommandCopy
                command={
                  true
                    ? `uproll deploy ${"id"}`
                    : `Save to generate a deploy command`
                }
                disabled={!true}
              />
            </div>
            {true && (
              <ModalAlert
                title="Delete Configuration?"
                description="Are you sure you want to delete this configuration? This action cannot be undone."
                onContinue={() => {}}
              />
            )}
          </div>
        </div>
      </HeroWrapper>
      <div className="space-y-6 max-w-4xl mx-auto p-3 sm:p-6">
        <SettlementLayerForm
          register={register}
          control={control}
          errors={errors}
        />
        <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
          <legend className="px-2 text-lg font-semibold space-x-2 flex items-center justify-between gap-2">
            Participants
            <Button
              size={null}
              type="button"
              onClick={() =>
                append({
                  el_type: "op-geth",
                  el_image: "op-geth:latest",
                  cl_type: "op-node",
                  cl_image: "op-node:latest",
                })
              }
              className="p-0.5 rounded-full"
            >
              <Plus />
            </Button>
          </legend>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <ParticipantForm
                index={index}
                register={register}
                control={control}
                errors={errors}
                remove={remove}
              />
              {index < fields.length - 1 && (
                <div className="border-t border-gray-300 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </fieldset>
        <SignerConfigForm register={register} errors={errors} />
        <AdminConfigForm register={register} errors={errors} />
        <ChainConfigForm register={register} errors={errors} />
        <GasConfigForm register={register} errors={errors} />
      </div>
    </form>
  );
};

export default RollupConfigForm;
