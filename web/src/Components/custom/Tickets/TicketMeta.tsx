interface TicketMetaProps {
    supporters: string[];
  }
  
  export const TicketMeta = ({ supporters }: TicketMetaProps) => (
    <div className="text-sm text-zinc-400">
      {supporters.length} supporter{supporters.length !== 1 ? "s" : ""}
    </div>
  );
  