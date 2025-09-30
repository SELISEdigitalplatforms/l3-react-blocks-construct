import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Accordion',
  component: Accordion,
  parameters: {},
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
};
