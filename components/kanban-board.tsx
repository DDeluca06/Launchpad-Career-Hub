"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/basic/card';
import { ChevronDown, ChevronUp, Building, Calendar } from 'lucide-react';

// Define the application stages matching the image
const MAIN_STAGES = ['interested', 'applied', 'interview', 'offer', 'referrals'] as const;

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
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' }
  ]
};

interface Application {
  id: string | number;
  job?: {
    title: string;
    company: string;
  };
  title?: string;
  company?: string;
  status: string;
  subStage?: string | null;
  updatedAt: string;
}

interface KanbanBoardProps {
  applications?: Application[];
  isLoading?: boolean;
  onStatusChange?: (applicationId: string, newStatus: string, subStage?: string) => void;
}

export default function KanbanBoard({ 
  applications = [], 
  isLoading = false,
  onStatusChange 
}: KanbanBoardProps) {
  // Keep track of expanded sub-stages
  const [expandedColumns, setExpandedColumns] = useState({
    interview: true,
    offer: true
  });

  // Process applications to ensure all required fields
  const processedApplications = applications.map(app => ({
    ...app,
    // Ensure id is a string
    id: String(app.id),
    job: app.job || {
      title: app.title || 'Unknown Position',
      company: app.company || 'Unknown Company'
    },
    status: MAIN_STAGES.includes(app.status as any) ? app.status : 'applied'
  }));

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

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Parse the destination droppable ID to extract main stage and sub-stage
    const [destStage, destSubStage] = destination.droppableId.split(':');

    // Call the callback if provided
    if (onStatusChange) {
      onStatusChange(draggableId, destStage, destSubStage);
    }
  };

  // Get column background color based on status
  const getColumnColor = (status: string) => {
    switch(status) {
      case 'interested': return 'bg-blue-50';
      case 'applied': return 'bg-indigo-50';
      case 'interview': return 'bg-purple-50';
      case 'offer': return 'bg-green-50';
      case 'referrals': return 'bg-amber-50';
      default: return 'bg-gray-50';
    }
  };

  // Get card accent color based on status
  const getCardAccent = (status: string, subStage?: string | null) => {
    if (status === 'interview') return 'border-l-4 border-l-purple-400';
    if (status === 'offer') {
      if (subStage === 'rejected') return 'border-l-4 border-l-red-400';
      if (subStage === 'accepted') return 'border-l-4 border-l-emerald-400';
      return 'border-l-4 border-l-green-400';
    }
    if (status === 'interested') return 'border-l-4 border-l-blue-400';
    if (status === 'applied') return 'border-l-4 border-l-indigo-400';
    if (status === 'referrals') return 'border-l-4 border-l-amber-400';
    return '';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-5 gap-4">
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
    );
  }

  // Render application card
  const renderCard = (app: Application, provided: any) => (
    <Card
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-4 mb-3 bg-white cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${getCardAccent(app.status, app.subStage)} shadow-sm`}
    >
      <h3 className="font-medium text-gray-800">
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
      {app.subStage && (
        <div className="mt-3 inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
          {app.status === 'interview' && SUB_STAGES.interview.find(s => s.id === app.subStage)?.label}
          {app.status === 'offer' && SUB_STAGES.offer.find(s => s.id === app.subStage)?.label}
          {(!app.status || (app.status !== 'interview' && app.status !== 'offer')) && app.subStage}
        </div>
      )}
    </Card>
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-5 gap-4">
            {/* Interested Column */}
            <div className="flex flex-col space-y-4">
              <div className="font-medium capitalize text-gray-700 flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                Interested ({columns.interested?.length || 0})
              </div>
              <Droppable droppableId="interested">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-lg p-3 min-h-[500px] ${getColumnColor('interested')}`}
                  >
                    {columns.interested?.length ? (
                      columns.interested.map((app, index) => (
                        <Draggable
                          key={String(app.id)}
                          draggableId={String(app.id)}
                          index={index}
                        >
                          {(provided) => renderCard(app, provided)}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No jobs</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Applied Column */}
            <div className="flex flex-col space-y-4">
              <div className="font-medium capitalize text-gray-700 flex items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-400 mr-2"></span>
                Applied ({columns.applied?.length || 0})
              </div>
              <Droppable droppableId="applied">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-lg p-3 min-h-[500px] ${getColumnColor('applied')}`}
                  >
                    {columns.applied?.length ? (
                      columns.applied.map((app, index) => (
                        <Draggable
                          key={String(app.id)}
                          draggableId={String(app.id)}
                          index={index}
                        >
                          {(provided) => renderCard(app, provided)}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No jobs</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Interview Column with Sub-stages */}
            <div className="flex flex-col space-y-4">
              <div className="font-medium flex items-center justify-between text-gray-700">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-400 mr-2"></span>
                  <span>Interview ({columns.interview?.length || 0})</span>
                </div>
                <button 
                  onClick={() => toggleExpand('interview')}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  {expandedColumns.interview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedColumns.interview ? (
                // Expanded view with sub-stages
                <div className="space-y-4">
                  {SUB_STAGES.interview.map(subStage => {
                    const subStageApps = columns.interview?.filter(
                      app => app.subStage === subStage.id
                    ) || [];
                    
                    return (
                      <div key={subStage.id} className="space-y-2">
                        <div className="text-sm text-gray-600 flex items-center">
                          <span>{subStage.label}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            ({subStageApps.length})
                          </span>
                        </div>
                        <Droppable droppableId={`interview:${subStage.id}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`rounded-lg p-3 min-h-[100px] ${getColumnColor('interview')}`}
                            >
                              {subStageApps.length ? (
                                subStageApps.map((app, index) => (
                                  <Draggable
                                    key={String(app.id)}
                                    draggableId={String(app.id)}
                                    index={index}
                                  >
                                    {(provided) => renderCard(app, provided)}
                                  </Draggable>
                                ))
                              ) : (
                                <div className="text-center py-4 text-gray-500">No applications here yet</div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Collapsed view
                <Droppable droppableId="interview">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-lg p-3 min-h-[500px] ${getColumnColor('interview')}`}
                    >
                      {columns.interview?.length ? (
                        columns.interview.map((app, index) => (
                          <Draggable
                            key={String(app.id)}
                            draggableId={String(app.id)}
                            index={index}
                          >
                            {(provided) => renderCard(app, provided)}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">No jobs</div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>

            {/* Offer Column with Sub-stages */}
            <div className="flex flex-col space-y-4">
              <div className="font-medium flex items-center justify-between text-gray-700">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                  <span>Offer ({columns.offer?.length || 0})</span>
                </div>
                <button 
                  onClick={() => toggleExpand('offer')}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  {expandedColumns.offer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {expandedColumns.offer ? (
                // Expanded view with sub-stages
                <div className="space-y-4">
                  {SUB_STAGES.offer.map(subStage => {
                    const subStageApps = columns.offer?.filter(
                      app => app.subStage === subStage.id
                    ) || [];
                    
                    return (
                      <div key={subStage.id} className="space-y-2">
                        <div className="text-sm text-gray-600 flex items-center">
                          <span>{subStage.label}</span>
                          <span className="ml-2 text-xs text-gray-400">
                            ({subStageApps.length})
                          </span>
                        </div>
                        <Droppable droppableId={`offer:${subStage.id}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`rounded-lg p-3 min-h-[100px] ${getColumnColor('offer')}${subStage.id === 'rejected' ? ' bg-red-50' : ''}${subStage.id === 'accepted' ? ' bg-emerald-50' : ''}`}
                            >
                              {subStageApps.length ? (
                                subStageApps.map((app, index) => (
                                  <Draggable
                                    key={String(app.id)}
                                    draggableId={String(app.id)}
                                    index={index}
                                  >
                                    {(provided) => renderCard(app, provided)}
                                  </Draggable>
                                ))
                              ) : (
                                <div className="text-center py-4 text-gray-500">No applications here yet</div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Collapsed view
                <Droppable droppableId="offer">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-lg p-3 min-h-[500px] ${getColumnColor('offer')}`}
                    >
                      {columns.offer?.length ? (
                        columns.offer.map((app, index) => (
                          <Draggable
                            key={String(app.id)}
                            draggableId={String(app.id)}
                            index={index}
                          >
                            {(provided) => renderCard(app, provided)}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">No jobs</div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>

            {/* Referrals Column */}
            <div className="flex flex-col space-y-4">
              <div className="font-medium capitalize text-gray-700 flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-400 mr-2"></span>
                Referrals ({columns.referrals?.length || 0})
              </div>
              <Droppable droppableId="referrals">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-lg p-3 min-h-[500px] ${getColumnColor('referrals')}`}
                  >
                    {columns.referrals?.length ? (
                      columns.referrals.map((app, index) => (
                        <Draggable
                          key={String(app.id)}
                          draggableId={String(app.id)}
                          index={index}
                        >
                          {(provided) => renderCard(app, provided)}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No jobs</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
