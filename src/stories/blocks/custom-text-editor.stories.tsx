import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { CustomTextEditor } from '@/components/core';

const meta: Meta<typeof CustomTextEditor> = {
  title: 'CustomTextEditor',
  component: CustomTextEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A rich text editor component built with Quill that provides formatting options and custom submission controls.',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    submitName: { control: 'text' },
    cancelButton: { control: 'text' },
    showIcons: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CustomTextEditor>;

const DefaultComponent = (args: any) => {
  const [content, setContent] = useState('<p>Start typing your content here...</p>');

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('Editor content submitted:', content);
    alert('Content submitted! Check console for details.');
  };

  const handleCancel = () => {
    setContent('');
    // eslint-disable-next-line no-console
    console.log('Editor content cleared');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Rich Text Editor</h3>
      <CustomTextEditor
        {...args}
        value={content}
        onChange={setContent}
        submitName="Save"
        cancelButton="Clear"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Raw Content:</h4>
        <pre className="text-xs text-gray-600 overflow-auto">{content}</pre>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: DefaultComponent,
};

const BlogPostComponent = (args: any) => {
  const [content, setContent] = useState(
    '<h2>Blog Post Title</h2><p>Write your blog post content here. You can use <strong>bold</strong>, <em>italic</em>, and other formatting options.</p>'
  );

  const handlePublish = () => {
    // eslint-disable-next-line no-console
    console.log('Blog post published:', content);
    alert('Blog post published successfully!');
  };

  const handleSaveDraft = () => {
    // eslint-disable-next-line no-console
    console.log('Blog post saved as draft:', content);
    alert('Draft saved!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">Create Blog Post</h3>
      <CustomTextEditor
        {...args}
        value={content}
        onChange={setContent}
        submitName="Publish"
        cancelButton="Save Draft"
        showIcons={true}
        onSubmit={handlePublish}
        onCancel={handleSaveDraft}
      />
    </div>
  );
};

export const BlogPost: Story = {
  render: BlogPostComponent,
};

const CommentEditorComponent = (args: any) => {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (!content.trim()) {
      alert('Please enter a comment');
      return;
    }
    // eslint-disable-next-line no-console
    console.log('Comment posted:', content);
    alert('Comment posted successfully!');
    setContent('');
  };

  const handleCancel = () => {
    setContent('');
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg border">
      <h4 className="font-medium mb-4">Add a comment</h4>
      <CustomTextEditor
        {...args}
        value={content}
        onChange={setContent}
        submitName="Post Comment"
        cancelButton="Cancel"
        showIcons={true}
        onSubmit={handlePost}
        onCancel={handleCancel}
      />
    </div>
  );
};

export const CommentEditor: Story = {
  render: CommentEditorComponent,
};

const WithoutIconsComponent = (args: any) => {
  const [content, setContent] = useState('<p>This editor has no media icons displayed.</p>');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Minimal Editor</h3>
      <CustomTextEditor
        {...args}
        value={content}
        onChange={setContent}
        submitName="Submit"
        cancelButton="Reset"
        showIcons={false}
        onSubmit={() => alert('Submitted!')}
        onCancel={() => setContent('')}
      />
    </div>
  );
};

export const WithoutIcons: Story = {
  render: WithoutIconsComponent,
};

export const ReadOnly: Story = {
  render: (args) => {
    const content =
      '<h3>Read-Only Content</h3><p>This content is <strong>read-only</strong> and cannot be edited. The editor is used purely for display purposes.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Display Mode</h3>
        <CustomTextEditor
          {...args}
          value={content}
          onChange={() => {
            /* no-op for read-only */
          }}
          showIcons={false}
        />
      </div>
    );
  },
};
