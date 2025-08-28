import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';
import CustomPaginationEmail from '../../components/blocks/custom-pagination-email/custom-pagination-email';

const meta: Meta<typeof CustomPaginationEmail> = {
  title: 'Block Components/CustomPaginationEmail',
  component: CustomPaginationEmail,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A reusable pagination component that displays page information and navigation controls. Shows the current range of items being displayed and provides buttons to navigate between pages.',
      },
    },
  },
  argTypes: {
    totalItems: { control: 'number' },
    itemsPerPage: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof CustomPaginationEmail>;

export const Default: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
  },
};

export const SmallDataset: Story = {
  args: {
    totalItems: 25,
    itemsPerPage: 5,
  },
};

export const LargeDataset: Story = {
  args: {
    totalItems: 1000,
    itemsPerPage: 50,
  },
};

export const SinglePage: Story = {
  args: {
    totalItems: 8,
    itemsPerPage: 10,
  },
};

export const WithCallback: Story = {
  render: (args) => {
    const [currentPageInfo, setCurrentPageInfo] = useState('No page selected yet');
    
    const handlePageChange = (page: number) => {
      setCurrentPageInfo(`Navigated to page ${page}`);
      console.log('Page changed to:', page);
    };
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">Page Change Info:</p>
          <p className="font-medium">{currentPageInfo}</p>
        </div>
        <CustomPaginationEmail
          {...args}
          totalItems={150}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      </div>
    );
  },
};

export const EmailList: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const emails = Array.from({ length: 47 }, (_, i) => ({
      id: i + 1,
      subject: `Email Subject ${i + 1}`,
      sender: `sender${i + 1}@example.com`,
      date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    }));
    
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleEmails = emails.slice(startIndex, startIndex + itemsPerPage);
    
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-semibold">Email List</h3>
        <div className="space-y-2">
          {visibleEmails.map(email => (
            <div key={email.id} className="p-3 border rounded-lg">
              <div className="font-medium">{email.subject}</div>
              <div className="text-sm text-gray-600">From: {email.sender}</div>
              <div className="text-xs text-gray-500">{email.date}</div>
            </div>
          ))}
        </div>
        <CustomPaginationEmail
          totalItems={emails.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};