import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import { Textarea } from "@/components/ui/form/textarea";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/basic/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlay/popover";

interface Interview {
  interview_id: number;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  location: string;
  candidate_name: string;
  position: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
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
}

interface NewInterview {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  location: string;
  candidate_name: string;
  position: string;
}

export function InterviewFormModal({ open, onOpenChange, onSubmit, selectedDate, editInterview, users }: InterviewFormModalProps) {
  const [formData, setFormData] = useState<NewInterview>({
    title: "",
    description: "",
    start_time: selectedDate,
    end_time: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hour later
    location: "",
    candidate_name: "",
    position: "",
  });
  const [candidateSearch, setCandidateSearch] = useState("");
  const [positionSearch, setPositionSearch] = useState("");

  useEffect(() => {
    if (editInterview) {
      setFormData({
        title: editInterview.title,
        description: editInterview.description,
        start_time: new Date(editInterview.start_time),
        end_time: new Date(editInterview.end_time),
        location: editInterview.location,
        candidate_name: editInterview.candidate_name,
        position: editInterview.position,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        start_time: selectedDate,
        end_time: new Date(selectedDate.getTime() + 60 * 60 * 1000),
      }));
    }
  }, [editInterview, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "start_time" | "end_time") => {
    setFormData(prev => ({ ...prev, [field]: new Date(e.target.value) }));
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

  const positions = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
  ];

  const filteredPositions = positions.filter(position => 
    position.toLowerCase().includes(positionSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editInterview ? { ...formData, interview_id: editInterview.interview_id } : formData);
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
                value={formData.description}
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
                value={formData.start_time.toISOString().slice(0, 16)}
                onChange={(e) => handleDateChange(e, "start_time")}
                required
              />
            </div>
            <div>
              <label htmlFor="end_time">End Time</label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time.toISOString().slice(0, 16)}
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
                      {filteredPositions.map((position) => (
                        <CommandItem
                          key={position}
                          onSelect={() => handlePositionSelect(position)}
                        >
                          {position}
                        </CommandItem>
                      ))}
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