import React, { useState } from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { useTicket } from '../../../hooks/Ticket.hooks';
import { deleteTicket } from '../../../service/Ticket.service';
import TicketChatArea from '../../custom/Tickets/TicketChatArea';
import TicketChatLink from '../../custom/Tickets/TicketChatLink';
import TicketDescription from '../../custom/Tickets/TicketDescription';
import TicketHeader from '../../custom/Tickets/TicketHeader';
import { TicketModal } from '../../custom/Tickets/TicketModal';
import ServerErrorPage from '../lib/ServerErrorPage';


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
        <div className="bg-zinc-900 min-h-full p-6 text-white overflow-hidden">
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
                                supporters={ticket.supporterNames}
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
                        <div className="flex flex-col h-[calc(100vh-450px)]"> {/* Adjust 100px if you have a header */}
                            <div className="flex flex-col flex-1 bg-zinc-800 rounded-2xl mt-4 shadow-md overflow-hidden">
                                <div className="flex flex-col h-full">
                                    <div className="text-xl font-semibold mb-2 flex flex-row items-center pt-4 pl-4">
                                        <div className="mr-2 text-lg text-cyan-400">
                                            <IoChatboxEllipsesOutline />
                                        </div>
                                        Ticket-Chat
                                    </div>
                                    <p className="pb-4 pl-4">Hier kannst du dich mit unserem IT-Team direkt austauschen.</p>

                                    <div className="flex-1 min-h-0 border-t border-zinc-700 px-4 pt-4 pb-4 overflow-y-auto">
                                        <TicketChatArea
                                            chatId={ticket.id}
                                            ticketId={ticket.id}
                                            userType="USER"
                                        />
                                    </div>
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
