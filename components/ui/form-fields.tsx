import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  type: React.HTMLInputTypeAttribute
  errormessage?: string
}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label: string
  errormessage?: string
}

const Label = ({ name, label }: { name: string; label: string }) => {
  return (
    <label className="label" htmlFor={name}>
      <span className="label-text">{label}</span>
    </label>
  )
}

const ErrorMessage = ({ message }: { message: string | undefined }) => {
  return (
    <span className="ml-1 mt-1 flex text-xs font-medium tracking-wide text-destructive-foreground">
      {message}
    </span>
  )
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <>
        <Label label={props.label} name={props.name} />
        <Input
          className={cn(props.errormessage && "border-destructive", className)}
          ref={ref}
          {...props}
        />
        <ErrorMessage message={props.errormessage && props.errormessage} />
      </>
    )
  }
)

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <>
        <Label label={props.label} name={props.name} />
        <textarea
          className={cn(props.errormessage && "border-destructive", className)}
          {...props}
          ref={ref}
        />
        {/* <ErrorMessage message={props.errorMessage} /> */}
      </>
    )
  }
)

FormInput.displayName = "FormInput"
TextArea.displayName = "TextArea"

export { FormInput, Label, ErrorMessage, TextArea }
