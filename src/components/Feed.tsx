import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";
import { api, Post, queryKeys } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";

export const Feed = () => {
  const queryClient = useQueryClient();
  const [isSeeding, setIsSeeding] = useState(false);

  const { 
    data: posts, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: queryKeys.posts,
    queryFn: api.getPosts,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    retry: 2,
  });

  // Function to seed demo data
  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      await api.seedDemoData();
      toast.success("Demo data created! Refreshing posts...");
      refetch();
    } catch (error) {
      console.error("Failed to seed demo data:", error);
      toast.error("Failed to create demo data");
    } finally {
      setIsSeeding(false);
    }
  };

  // Function to handle successful post creation
  const handlePostCreated = (newPost: Post) => {
    queryClient.setQueryData(queryKeys.posts, (oldPosts: Post[] | undefined) => {
      if (!oldPosts) return [newPost];
      return [newPost, ...oldPosts];
    });
    toast.success("Post created successfully!");
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PostComposer onPostCreated={handlePostCreated} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-python-blue mx-auto mb-4" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <PostComposer onPostCreated={handlePostCreated} />
        <div className="text-center py-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load posts</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleSeedDemo} disabled={isSeeding} size="sm">
                {isSeeding ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Create Demo Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostComposer onPostCreated={handlePostCreated} />
      
      {/* Empty state */}
      {posts && posts.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-card border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share something with the community, or load some demo content!
            </p>
            <Button onClick={handleSeedDemo} disabled={isSeeding}>
              {isSeeding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Create Demo Posts
            </Button>
          </div>
        </div>
      )}

      {/* Posts list */}
      {posts && posts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={() => refetch()} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          {posts.map((post) => (
            <PostCard 
              key={post.id}
              id={post.id}
              author={post.author.name || 'Anonymous'}
              handle={post.author.username || 'anonymous'}
              time={new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              content={post.content}
              code={post.code}
              language={post.language}
              likes={post._count.likes}
              comments={post._count.comments}
              isLiked={false} // TODO: Implement user-specific like status
              avatar={post.author.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};