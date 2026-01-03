import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface ScheduledPostsProps {
  scheduledPosts: any[];
  onEdit: (post: any) => void;
  onDelete: (id: number) => void;
  onUpdateSchedule: (id: number, scheduledDate: Date) => void;
  onRefetch: () => void;
}

export function ScheduledPosts({ 
  scheduledPosts, 
  onEdit, 
  onDelete, 
  onUpdateSchedule, 
  onRefetch 
}: ScheduledPostsProps) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [newScheduledDate, setNewScheduledDate] = useState("");

  const handleEditSchedule = (post: any) => {
    setSelectedPost(post);
    setNewScheduledDate(post.scheduledAt ? 
      new Date(post.scheduledAt).toISOString().slice(0, 16) : ""
    );
    setShowEditScheduleDialog(true);
  };

  const handleUpdateSchedule = () => {
    if (selectedPost && newScheduledDate) {
      onUpdateSchedule(selectedPost.id, new Date(newScheduledDate));
      setShowEditScheduleDialog(false);
      setSelectedPost(null);
      setNewScheduledDate("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold heading-georgia">Scheduled Posts</h2>
          <p className="text-sm text-gray-600 text-poppins">
            Manage posts scheduled for automatic publishing
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {scheduledPosts.length} scheduled
        </Badge>
      </div>

      {scheduledPosts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 heading-georgia">
              No scheduled posts
            </h3>
            <p className="text-gray-600 text-poppins">
              Schedule posts from your drafts to automatically publish them at a specific time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold heading-georgia">
                        {post.title}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        Scheduled
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {post.scheduledAt ? 
                            format(new Date(post.scheduledAt), 'MMM d, yyyy \'at\' HH:mm') :
                            'No date set'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created {format(new Date(post.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 text-poppins">
                      {post.excerpt || post.content?.substring(0, 120) + '...'}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSchedule(post)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Edit Date/Time
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditScheduleDialog} onOpenChange={setShowEditScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scheduled Date & Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Post Title
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {selectedPost?.title}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Scheduled Date & Time
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {selectedPost?.scheduledAt ? 
                  format(new Date(selectedPost.scheduledAt), 'MMM d, yyyy \'at\' HH:mm') :
                  'No date set'
                }
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                New Scheduled Date & Time
              </label>
              <Input
                type="datetime-local"
                value={newScheduledDate}
                onChange={(e) => setNewScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdateSchedule}
                disabled={!newScheduledDate}
                className="flex-1"
              >
                Update Schedule
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowEditScheduleDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}