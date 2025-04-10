import React from 'react';
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

interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  program: string;
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: NewUserData;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserData>>;
  onCreateUser: () => Promise<void>;
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
}: CreateUserModalProps) {
  return (
    <MultiPurposeModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New User"
      size="md"
      showFooter={true}
      primaryActionText="Create User"
      onPrimaryAction={onCreateUser}
      secondaryActionText="Cancel"
      onSecondaryAction={() => onOpenChange(false)}
    >
      <div className="py-4 space-y-4">
        <p className="text-sm text-gray-500 mb-4">Add a new applicant user to the system</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            placeholder="Email"
            type="email"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Password"
            type="password"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="program">Program</Label>
          <Select
            value={newUser.program}
            onValueChange={(value: string) => setNewUser({ ...newUser, program: value })}
          >
            <SelectTrigger id="program">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101</SelectItem>
              <SelectItem value="LIFTOFF">LIFTOFF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </MultiPurposeModal>
  );
} 