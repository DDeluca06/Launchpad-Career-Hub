import React, { Dispatch, SetStateAction } from 'react';
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/basic/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { MultiPurposeModal } from "@/components/ui/overlay/multi-purpose-modal";
import { extendedPalette } from "@/lib/colors";
import { NewUserData } from "./types";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: NewUserData;
  setNewUser: Dispatch<SetStateAction<NewUserData>>;
  onCreateUser: () => void;
  isEditMode?: boolean;
}

/**
 * Modal component for creating a new user/applicant
 */
export function CreateUserModal({
  open,
  onOpenChange,
  newUser,
  setNewUser,
  onCreateUser,
  isEditMode = false,
}: CreateUserModalProps) {
  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Applicant" : "Add New Applicant"}
      size="sm"
      showFooter={true}
      primaryActionText={isEditMode ? "Save Changes" : "Create"}
      onPrimaryAction={onCreateUser}
      secondaryActionText="Cancel"
      onSecondaryAction={() => onOpenChange(false)}
    >
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="john.doe@example.com"
            disabled={isEditMode}
          />
        </div>

        {!isEditMode && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="program">Program</Label>
          <Select
            value={newUser.program}
            onValueChange={(value) =>
              setNewUser((prev) => ({ ...prev, program: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101</SelectItem>
              <SelectItem value="FOUNDATION">Foundations</SelectItem>
              <SelectItem value="LIFTOFF">Liftoff</SelectItem>
              <SelectItem value="ALUMNI">Alumni</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </MultiPurposeModal>
  );
} 