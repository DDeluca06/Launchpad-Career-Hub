import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/basic/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlay/popover";

interface Interview {
  interview_id: number;
  user_id: number;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  candidate_name: string;
  position: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface InterviewFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewInterview | Partial<Interview>) => void;
  selectedDate: Date;
  editInterview?: Interview;
  users: User[];
  availableJobs: { id: number; title: string }[];
}

interface NewInterview {
  title: string;
  description?: string;
  location: string;
  start_time: string;
  end_time: string;
  candidate_name: string;
  position: string;
}

export function InterviewFormModal({ open, onOpenChange, onSubmit, selectedDate, editInterview, users, availableJobs }: InterviewFormModalProps) {
  const [formData, setFormData] = useState<NewInterview>({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    candidate_name: "",
    position: "",
  });
  const [candidateSearch, setCandidateSearch] = useState("");
  const [positionSearch, setPositionSearch] = useState("");

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      start_time: "",
      end_time: "",
      candidate_name: "",
      position: "",
    });
    setCandidateSearch("");
    setPositionSearch("");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    if (editInterview) {
      setFormData({
        title: editInterview.title,
        description: editInterview.description || "",
        location: editInterview.location,
        start_time: editInterview.start_time,
        end_time: editInterview.end_time,
        candidate_name: editInterview.candidate_name,
        position: editInterview.position,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        start_time: selectedDate.toISOString().slice(0, 16),
        end_time: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
      }));
    }
  }, [editInterview, selectedDate, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "start_time" | "end_time") => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCandidateSelect = (name: string) => {
    setFormData(prev => ({ ...prev, candidate_name: name }));
  };

  const handlePositionSelect = (position: string) => {
    setFormData(prev => ({ ...prev, position }));
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const filteredPositions = availableJobs?.filter(job => 
    job.title.toLowerCase().includes(positionSearch.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = editInterview 
      ? { 
          ...formData, 
          interview_id: editInterview.interview_id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: editInterview.status
        }
      : { 
          ...formData, 
          status: 'SCHEDULED' as const,
          start_time: formData.start_time,
          end_time: formData.end_time
        };
    onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editInterview ? "Edit Interview" : "Schedule Interview"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Interview Title"
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Interview details..."
                required
              />
            </div>
            <div>
              <label htmlFor="start_time">Start Time</label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleDateChange(e, "start_time")}
                required
              />
            </div>
            <div>
              <label htmlFor="end_time">End Time</label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleDateChange(e, "end_time")}
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Interview location or meeting link"
                required
              />
            </div>
            <div>
              <label>Candidate</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {formData.candidate_name || "Select Candidate"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search candidates..."
                      value={candidateSearch}
                      onValueChange={setCandidateSearch}
                    />
                    <CommandList>
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.user_id}
                          onSelect={() => handleCandidateSelect(`${user.first_name} ${user.last_name}`)}
                        >
                          {user.first_name} {user.last_name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label>Position</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {formData.position || "Select Position"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search positions..."
                      value={positionSearch}
                      onValueChange={setPositionSearch}
                    />
                    <CommandList>
                      {filteredPositions.length > 0 ? (
                        filteredPositions.map((job) => (
                          <CommandItem
                            key={job.id}
                            onSelect={() => handlePositionSelect(job.title)}
                          >
                            {job.title}
                          </CommandItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          {availableJobs === undefined ? "Loading positions..." : "No positions found"}
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editInterview ? "Update" : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 