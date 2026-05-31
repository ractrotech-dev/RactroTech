import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-wider md:text-3xl">Create New Post</h1>
        <p className="mt-1 text-xs font-bold tracking-wider text-black/40">Draft your next masterpiece</p>
      </div>
      <PostForm />
    </div>
  );
}
