import React from 'react';

interface TicketDescriptionProps {
  description: string;
}

const TicketDescription: React.FC<TicketDescriptionProps> = ({ description }) => {
  return (
    <section>
      <h3 className="text-lg font-medium text-zinc-300 mb-2">Beschreibung</h3>
      <p className="text-sm text-zinc-100 whitespace-pre-line">{description}</p>
    </section>
  );
};

export default TicketDescription;
