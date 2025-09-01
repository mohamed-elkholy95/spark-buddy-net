import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";

const samplePosts = [
  {
    author: "Alice Chen",
    handle: "alice_codes",
    time: "2h ago",
    content: "Just discovered this amazing Python pattern for handling async operations! Who else loves using context managers with async/await? 🐍✨",
    code: `async with AsyncSessionManager() as session:
    data = await session.fetch_data()
    await session.process(data)`,
    likes: 24,
    comments: 8,
    isLiked: true
  },
  {
    author: "Bob Rodriguez",
    handle: "pythonista_bob",
    time: "4h ago",
    content: "Building a machine learning pipeline for sentiment analysis. The community here has been incredibly helpful with debugging my model! Thanks everyone 💚",
    likes: 15,
    comments: 12
  },
  {
    author: "Sarah Kim",
    handle: "data_sarah",
    time: "6h ago",
    content: "Quick tip: Use list comprehensions wisely! They're powerful but readability should always come first.",
    code: `# Good
numbers = [x * 2 for x in range(10)]

# Better for complex logic
def process_numbers():
    return [transform(x) for x in data if is_valid(x)]`,
    likes: 42,
    comments: 6
  },
  {
    author: "Dev Community Bot",
    handle: "pyconnect_ai",
    time: "8h ago",
    content: "🤖 AI Tip: Need help with your Python code? I can help you debug, explain concepts, or suggest improvements. Just mention @pyconnect_ai in your post!",
    likes: 8,
    comments: 3
  }
];

export const Feed = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostComposer />
      <div className="space-y-4">
        {samplePosts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
};