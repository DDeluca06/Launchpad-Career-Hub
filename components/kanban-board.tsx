"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/basic/card';
import { 
  ChevronDown, 
  ChevronUp, 
  Building, 
  Calendar, 
  XCircle, 
  CheckCircle, 
  ExternalLink,
  MoreVertical,
  GripVertical,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from '@hello-pangea/dnd';
import { toast } from '@/components/ui/feedback/use-toast';

// Define the application stages matching the image
const MAIN_STAGES = ['interested', 'applied', 'interview', 'offer', 'referrals', 'accepted', 'rejected'] as const;

// Define sub-stages for expandable columns
const SUB_STAGES = {
  interview: [
    { id: 'phone_screening', label: 'Phone Screening' },
    { id: 'interview_stage', label: 'Interview Stage' },
    { id: 'final_interview_stage', label: 'Final Interview Stage' }
  ],
  offer: [
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'offer_extended', label: 'Offer Extended' },
  ]
};

interface Application {
  id: string | number;
  job?: {
    title: string;
    company: string;
    id?: string | number;
  };
  title?: string;
  company?: string;
  status: string;
  subStage?: string | null;
  updatedAt: string;
  jobId?: string | number;
}

interface KanbanBoardProps {
  applications?: Application[];
  isLoading?: boolean;
  onStatusChange?: (applicationId: string, newStatus: string, subStage?: string) => void;
  onViewJobDetails?: (applicationId: string, jobId?: string | number) => void;
}

export default function KanbanBoard({ 
  applications = [], 
  isLoading = false,
  onStatusChange,
  onViewJobDetails
}: KanbanBoardProps) {
  const router = useRouter();
  
  // Keep track of expanded sub-stages
  const [expandedColumns, setExpandedColumns] = useState({
    interview: true,
    offer: true
  });
  
  // Track current view for mobile
  const [currentMobileView, setCurrentMobileView] = useState<string>('interested');
  
  // State to track if an update is in progress
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Local state for applications to prevent full rerenders
  const [localApplications, setLocalApplications] = useState<Application[]>([]);

  // Process applications to ensure all required fields
  const processedApplications = localApplications.map(app => ({
    ...app,
    // Ensure id is a string
    id: String(app.id),
    job: app.job || {
      title: app.title || 'Unknown Position',
      company: app.company || 'Unknown Company',
      id: app.jobId || app.id
    },
    status: MAIN_STAGES.includes(app.status as (typeof MAIN_STAGES)[number]) ? app.status : 'applied'
  }));
  
  // Update local state when applications prop changes
  useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);

  // Group applications by status and sub-status
  const columns = MAIN_STAGES.reduce((acc, status) => {
    acc[status] = processedApplications.filter(app => app.status === status);
    return acc;
  }, {} as Record<string, Application[]>);

  // Toggle expansion of sub-stages
  const toggleExpand = (columnId: 'interview' | 'offer') => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  // Handle card click to view job details
  const handleCardClick = (app: Application, e: React.MouseEvent) => {
    // Don't trigger when clicking on menu button or drag handle
    if ((e.target as HTMLElement).closest('.menu-button') || 
        (e.target as HTMLElement).closest('.drag-handle')) return;
    
    // Prevent the default click behavior which might cause page refresh
    e.preventDefault();
    e.stopPropagation();
    
    if (onViewJobDetails) {
      const jobId = app.job?.id || app.jobId || app.id;
      onViewJobDetails(String(app.id), jobId);
    } else {
      // Fallback - navigate to job details page
      const jobId = app.job?.id || app.jobId || app.id;
      router.push(`/applicant/jobs/${jobId}`);
    }
  };

  // Wrap button clicks in preventDefault to ensure no form submissions happen
  const preventFormSubmission = (callback: ((...args: unknown[]) => void)) => (e: React.MouseEvent, ...args: unknown[]) => {
    e.preventDefault();
    e.stopPropagation();
    callback(...args);
  };
  
  // Handle clicking outside of a card to prevent unexpected form submissions
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If we're clicking on a form button that's not inside our component, prevent it
      if (target.tagName === 'BUTTON' && 
          !target.closest('.kanban-board') && 
          !target.classList.contains('menu-button') &&
          !target.classList.contains('drag-handle')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a valid droppable area or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Extract the target status and potential sub-stage from the destination ID
    const [targetStatus, targetSubStage] = destination.droppableId.split(':');
    
    // Don't update if already updating
    if (updatingStatus === draggableId) return;
    
    // Get the application being moved
    const app = processedApplications.find(a => String(a.id) === draggableId);
    if (!app) return;
    
    // Set updating state
    setUpdatingStatus(draggableId);
    
    // Update local state immediately for a smoother UX
    setLocalApplications(prev => prev.map(app => {
      if (String(app.id) === draggableId) {
        return {
          ...app,
          status: targetStatus,
          subStage: targetSubStage || null
        };
      }
      return app;
    }));

    // Call onStatusChange callback if provided
    if (onStatusChange) {
      const updatePromise = Promise.resolve(onStatusChange(draggableId, targetStatus, targetSubStage));
      
      updatePromise
        .then(() => {
          setUpdatingStatus(null);
        })
        .catch((error: Error) => {
          console.error('Failed to update status:', error);
          toast({
            title: "Failed to update status",
            description: "There was an error moving the application. Please try again.",
            variant: "destructive"
          });
          // Revert to original state on error
          setLocalApplications(applications);
          setUpdatingStatus(null);
        });
    } else {
      setUpdatingStatus(null);
    }
  };

  // Get column background color based on status
  const getColumnColor = (status: string) => {
    switch(status) {
      case 'interested': return 'bg-blue-50 border border-blue-100';
      case 'applied': return 'bg-indigo-50 border border-indigo-100';
      case 'interview': return 'bg-purple-50 border border-purple-100';
      case 'offer': return 'bg-green-50 border border-green-100';
      case 'referrals': return 'bg-amber-50 border border-amber-100';
      case 'accepted': return 'bg-emerald-50 border border-emerald-100';
      case 'rejected': return 'bg-red-50 border border-red-100';
      default: return 'bg-gray-50 border border-gray-100';
    }
  };

  // Get card accent color based on status
  const getCardAccent = (status: string, subStage?: string | null) => {
    if (status === 'interview') return 'border-l-4 border-l-purple-400';
    if (status === 'offer') return 'border-l-4 border-l-green-400';
    if (status === 'interested') return 'border-l-4 border-l-blue-400';
    if (status === 'applied') return 'border-l-4 border-l-indigo-400';
    if (status === 'referrals' || subStage === 'referrals') return 'border-l-4 border-l-amber-400';
    if (status === 'accepted') return 'border-l-4 border-l-emerald-400';
    if (status === 'rejected') return 'border-l-4 border-l-red-400';
    return '';
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
        {/* Desktop Loading View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[1200px]">
            <div className="grid grid-cols-7 gap-4">
              {MAIN_STAGES.map((status) => (
                <div key={status} className="flex flex-col space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className={`flex-1 rounded-lg p-3 min-h-[500px] space-y-3 ${getColumnColor(status)}`}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-4 space-y-2 animate-pulse shadow-sm">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Loading View */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
            {MAIN_STAGES.map((status) => (
              <button 
                key={status} 
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${status === currentMobileView 
                  ? `${getColumnColor(status)} font-bold` 
                  : 'bg-gray-100'}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className={`rounded-lg p-3 min-h-[500px] space-y-3 ${getColumnColor('interested')}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 space-y-2 animate-pulse shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Render application card with menu
  const renderCard = (app: Application, index: number) => (
    <Draggable key={String(app.id)} draggableId={String(app.id)} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 ${updatingStatus === String(app.id) ? 'opacity-50' : ''}`}
        >
          <Card
            className={`p-4 bg-white hover:shadow-md transition-shadow ${
              getCardAccent(app.status, app.subStage)
            } shadow-sm group cursor-pointer relative ${
              snapshot.isDragging ? 'shadow-lg' : ''
            } aspect-[4/3]`}
            onClick={(e) => handleCardClick(app, e)}
          >
            <div 
              {...provided.dragHandleProps} 
              className="absolute top-2 left-2 cursor-move drag-handle"
            >
              <GripVertical size={16} className="text-gray-400 opacity-50 group-hover:opacity-100" />
            </div>
            
            <CardMenu app={app} onMoveToStatus={handleMoveToStatus} />
            
            <div className="pl-6 h-full flex flex-col">
              <h3 className="font-medium text-gray-800 pr-6 line-clamp-2">
                {app.job?.title || app.title || 'Unknown Position'}
              </h3>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Building className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate">{app.job?.company || app.company || 'Unknown Company'}</span>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex-grow"></div>

              {app.subStage && (
                <div className="mt-3 inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {app.status === 'interview' && SUB_STAGES.interview.find(s => s.id === app.subStage)?.label}
                  {app.status === 'offer' && SUB_STAGES.offer.find(s => s.id === app.subStage)?.label}
                  {(!app.status || (app.status !== 'interview' && app.status !== 'offer')) && app.subStage}
                </div>
              )}
              
              <div className="mt-3 text-xs text-blue-500 flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>View details</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  // Separate component for card menu to keep the main component clean
  const CardMenu = ({ app, onMoveToStatus }: { 
    app: Application, 
    onMoveToStatus: (appId: string, status: string, subStage?: string) => void 
  }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Handle status change from menu
    const handleMenuStatusChange = (e: React.MouseEvent, status: string, subStage?: string) => {
      e.preventDefault();
      e.stopPropagation();
      onMoveToStatus(String(app.id), status, subStage);
      setMenuOpen(false);
    };

    return (
      <div className="absolute top-2 right-2 z-10" ref={menuRef}>
        <button 
          type="button"
          className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity menu-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1 text-sm text-gray-700 font-medium px-3">Move to</div>
            {MAIN_STAGES.map(status => {
              if (status === app.status) return null; // Skip current status
              
              if (status === 'interview') {
                return (
                  <div key={status} className="border-t border-gray-100">
                    {SUB_STAGES.interview.map(subStage => (
                      <button 
                        type="button"
                        key={subStage.id}
                        onClick={(e) => handleMenuStatusChange(e, status, subStage.id)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 bg-purple-400`} />
                        <span>Interview: {subStage.label}</span>
                      </button>
                    ))}
                  </div>
                );
              }
              
              if (status === 'offer') {
                return (
                  <div key={status} className="border-t border-gray-100">
                    {SUB_STAGES.offer.map(subStage => (
                      <button 
                        type="button"
                        key={subStage.id}
                        onClick={(e) => handleMenuStatusChange(e, status, subStage.id)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 bg-green-400`} />
                        <span>Offer: {subStage.label}</span>
                      </button>
                    ))}
                  </div>
                );
              }
              
              return (
                <button 
                  type="button"
                  key={status}
                  onClick={(e) => handleMenuStatusChange(e, status)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center border-t border-gray-100"
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    status === 'interested' ? 'bg-blue-400' :
                    status === 'applied' ? 'bg-indigo-400' :
                    status === 'referrals' ? 'bg-amber-400' :
                    status === 'accepted' ? 'bg-emerald-400' :
                    status === 'rejected' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <span className="capitalize">{status}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Handle moving a card to a new status
  const handleMoveToStatus = (appId: string, newStatus: string, subStage?: string) => {
    // Don't update if already updating
    if (updatingStatus === appId) return;
    
    // Set updating state
    setUpdatingStatus(appId);
    
    // Update local state immediately for a smoother UX
    setLocalApplications(prev => prev.map(app => {
      if (String(app.id) === appId) {
        return {
          ...app,
          status: newStatus,
          subStage: subStage || null
        };
      }
      return app;
    }));
    
    // Call onStatusChange callback if provided
    if (onStatusChange) {
      try {
        // Handle as a promise to ensure we can set updatingStatus to null when done
        const updatePromise = Promise.resolve(onStatusChange(appId, newStatus, subStage));
        
        updatePromise
          .then(() => {
            setUpdatingStatus(null);
          })
          .catch((error: Error) => {
            console.error('Error updating status:', error);
            toast({
              title: "Failed to update status",
              description: "There was an error moving the application. Please try again.",
              variant: "destructive"
            });
            // Revert to original state on error
            setLocalApplications(applications);
            setUpdatingStatus(null);
          });
      } catch (error) {
        console.error('Error updating status:', error);
        setLocalApplications(applications);
        setUpdatingStatus(null);
      }
    } else {
      setUpdatingStatus(null);
    }
  };

  // Render a single column 
  const renderColumn = (status: string, isCollapsed = false) => {
    const droppableId = status;
    
    if (status === 'interview' && expandedColumns.interview && !isCollapsed) {
      return (
        <div className="space-y-4">
          {SUB_STAGES.interview.map(subStage => {
            const subStageApps = columns.interview?.filter(
              app => app.subStage === subStage.id
            ) || [];
            const subDroppableId = `${status}:${subStage.id}`;
            
            return (
              <div key={subStage.id} className="space-y-2">
                <div className="text-sm text-gray-600 flex items-center">
                  <span>{subStage.label}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({subStageApps.length})
                  </span>
                </div>
                <Droppable droppableId={subDroppableId}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg p-4 min-h-[150px] ${getColumnColor('interview')}`}
                    >
                      {subStageApps.length ? (
                        subStageApps.map((app, index) => renderCard(app, index))
                      ) : (
                        <div className="text-center py-6 text-gray-500">No applications here yet</div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      );
    } else if (status === 'offer' && expandedColumns.offer && !isCollapsed) {
      return (
        <div className="space-y-4">
          {SUB_STAGES.offer.map(subStage => {
            const subStageApps = columns.offer?.filter(
              app => app.subStage === subStage.id
            ) || [];
            const subDroppableId = `${status}:${subStage.id}`;
            
            return (
              <div key={subStage.id} className="space-y-2">
                <div className="text-sm text-gray-600 flex items-center">
                  <span>{subStage.label}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({subStageApps.length})
                  </span>
                </div>
                <Droppable droppableId={subDroppableId}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg p-4 min-h-[150px] ${getColumnColor('offer')}`}
                    >
                      {subStageApps.length ? (
                        subStageApps.map((app, index) => renderCard(app, index))
                      ) : (
                        <div className="text-center py-6 text-gray-500">No applications here yet</div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <Droppable droppableId={droppableId}>
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 rounded-lg p-4 min-h-[550px] ${getColumnColor(status)}`}
            >
              {columns[status]?.length ? (
                columns[status].map((app, index) => renderCard(app, index))
              ) : (
                <div className="text-center py-8 text-gray-500">No jobs</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
  };

  // Get column title with icon
  const getColumnTitle = (status: string) => {
    switch(status) {
      case 'accepted':
        return (
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></span>
            <CheckCircle className="h-4 w-4 mr-1.5 text-emerald-500" />
            <span>Accepted</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
            <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${
              status === 'interested' ? 'bg-blue-400' :
              status === 'applied' ? 'bg-indigo-400' :
              status === 'interview' ? 'bg-purple-400' :
              status === 'offer' ? 'bg-green-400' :
              status === 'referrals' ? 'bg-amber-400' : 'bg-gray-400'
            }`}></span>
            <span className="capitalize">{status}</span>
          </div>
        );
    }
  };

  // Add instructions for using the drag and drop
  const renderInstructions = () => (
    <div className="mb-2 text-xs text-gray-500 italic flex items-center">
      <AlertCircle className="w-3 h-3 mr-1" /> 
      <span>Drag and drop cards to move applications between stages, or use the menu (⋮)</span>
    </div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto pb-4 kanban-board">
        {renderInstructions()}
        <div className="min-w-[1400px]">
          <div className="grid grid-cols-7 gap-6">
            {/* Generate columns for desktop */}
            {MAIN_STAGES.map(status => (
              <div key={status} className="flex flex-col space-y-4 w-full">
                <div className="font-medium text-gray-700 flex items-center justify-between">
                  {getColumnTitle(status)}
                  {(status === 'interview' || status === 'offer') && (
                    <button 
                      type="button"
                      onClick={preventFormSubmission(() => toggleExpand(status as 'interview' | 'offer'))}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      {expandedColumns[status as 'interview' | 'offer'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  )}
                </div>
                
                {renderColumn(status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View - Make tabs more square */}
      <div className="md:hidden kanban-board">
        {renderInstructions()}
        <div className="flex overflow-x-auto space-x-3 pb-3 mb-4">
          {MAIN_STAGES.map((status) => (
            <button 
              type="button"
              key={status} 
              className={`px-5 py-3 rounded-lg text-sm whitespace-nowrap ${status === currentMobileView 
                ? `${getColumnColor(status)} font-bold border border-gray-300` 
                : 'bg-gray-100'}`}
              onClick={preventFormSubmission(() => setCurrentMobileView(status))}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1">({columns[status]?.length || 0})</span>
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="font-medium text-gray-700">
            {getColumnTitle(currentMobileView)}
          </div>
          {(currentMobileView === 'interview' || currentMobileView === 'offer') && (
            <button 
              type="button"
              onClick={preventFormSubmission(() => toggleExpand(currentMobileView as 'interview' | 'offer'))}
              className="p-1 rounded hover:bg-gray-200"
            >
              {expandedColumns[currentMobileView as 'interview' | 'offer'] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>

        {renderColumn(currentMobileView, true)}
      </div>
    </DragDropContext>
  );
}
