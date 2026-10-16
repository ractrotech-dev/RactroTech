import PageHeader from '@/components/admin/PageHeader';
import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New post"
        subtitle="Write a draft, preview it, then publish when it’s ready."
        backHref="/admin/content"
        backLabel="Content"
      />
      <PostForm />
    </div>
  );
}
