import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { useTicket } from '../../../hooks/Ticket.hooks';
import { deleteTicket } from '../../../service/Ticket.service';
import ServerErrorPage from '../lib/ServerErrorPage';
import TicketHeader from '../../custom/Tickets/TicketHeader';
import TicketDescription from '../../custom/Tickets/TicketDescription';
import TicketChatLink from '../../custom/Tickets/TicketChatLink';
import TicketChatArea from '../../custom/Tickets/TicketChatArea';
import { TicketModal } from '../../custom/Tickets/TicketModal';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';


const UserTicketViewPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();
    const { data: ticket, isLoading, isError, refetch } = useTicket(Number(ticketId));

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDeleteTicket = async (id: number) => {
        if (window.confirm("Bist du sicher, dass du dieses Ticket löschen möchtest?")) {
            await deleteTicket(id);
            navigate('/tickets');
        }
    };

    const handleEditTicket = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        refetch();
    };

    if (isError) {
        return <ServerErrorPage message="Fehler beim Laden der Ticket-Details." />;
    }

    return (
        <div className="bg-zinc-900 min-h-screen p-6 text-white overflow-hidden">
            {isLoading ? (
                <div className="flex justify-center mt-20">
                    <ClipLoader color="#22d3ee" size={50} />
                </div>
            ) : (
                ticket && (
                    <>
                        <div className="flex flex-col h-full bg-zinc-800 rounded-2xl shadow-md overflow-hidden">
                            <TicketHeader
                                title={ticket.title}
                                category={ticket.category != "" ? ticket.category : "Keine"}
                                supporters={ticket.supporterIds}
                                onEdit={handleEditTicket}
                                onDelete={() => handleDeleteTicket(ticket.id)}
                            />

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <TicketDescription description={ticket.description} />
                                {ticket.chatId && (
                                    <div className="border-t border-zinc-700 pt-4">
                                        <TicketChatLink chatId={ticket.chatId} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col h-full bg-zinc-800 rounded-2xl mt-4 shadow-md overflow-hidden">

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className={`text-xl font-semibold mb-2 flex flex-row items-center`}>
                                    <div className={`mr-2 text-lg text-cyan-400`}><IoChatboxEllipsesOutline /></div>
                                    Ticket-Chat
                                </div>
                                <p>Hier kannst du dich mit unserem IT-Team direkt austauschen.</p>
                                <div className="border-t border-zinc-700 pt-4">
                                    <TicketChatArea chatId={ticket.id} ticketId={ticket.id} />
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}

            {isEditModalOpen && (
                <TicketModal
                    ticketId={ticket?.id}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseModal}
                    mode="edit"
                />
            )}
        </div>
    );
};

export default UserTicketViewPage;
