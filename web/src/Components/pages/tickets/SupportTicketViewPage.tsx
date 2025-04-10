import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import {
    useAddTicketNote,
    useAllSupporters,
    useAssignSupporter,
    useRemoveTicketNote,
    useTicket,
    useTicketCategories,
    useTicketNotes,
    useUnassignSupporter,
    useUpdateTicket
} from "../../../hooks/Ticket.hooks";
import { AddNoteModal } from "../../custom/Tickets/view-support/AddNoteModal";
import SupportTicketHeader from "../../custom/Tickets/view-support/SupportTicketHeader";
import TicketNoteComponent from "../../custom/Tickets/view-support/TicketNote";
import ServerErrorPage from "../lib/ServerErrorPage";
import { TicketStatus } from "../../../types/Ticket.types";
import { TicketModal } from "../../custom/Tickets/TicketModal";
import { deleteTicket } from "../../../service/Ticket.service";
import TicketDescription from "../../custom/Tickets/TicketDescription";
import TicketChatLink from "../../custom/Tickets/TicketChatLink";
import { useGetUsername } from "../../../hooks/Profile.hooks";
import TicketChatArea from "../../custom/Tickets/TicketChatArea";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const SupportTicketViewPage = () => {
    const navigate = useNavigate();

    const { ticketId } = useParams();
    const id = Number(ticketId);

    const { data: ticket, isLoading, isError, refetch } = useTicket(id);
    const { data: categories } = useTicketCategories();
    const { data: allSupporters } = useAllSupporters();
    const { data: notes } = useTicketNotes(id);
    const { data: username } = useGetUsername();
    const updateTicket = useUpdateTicket();
    const addNote = useAddTicketNote();
    const removeNote = useRemoveTicketNote();
    const { mutate: addSupporter } = useAssignSupporter();
    const { mutate: removeSupporter } = useUnassignSupporter();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isNoteModalOpen, setNoteModalOpen] = useState(false);

    const handleAddNote = (content: string) => {
        addNote.mutate({ ticketId: id, content });
    };

    const handleDeleteNote = (noteId: number) => {
        removeNote.mutate(noteId, { onSuccess: () => refetch() });
    };

    const handleDeleteTicket = async () => {
        if (window.confirm("Bist du sicher, dass du dieses Ticket löschen möchtest?") && ticket) {
            await deleteTicket(ticket?.id);
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
        return <ServerErrorPage message="Ticket konnte nicht geladen werden." />;
    }

    return (
        <div>
            <AddNoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setNoteModalOpen(false)}
                onAdd={handleAddNote}
            />
            <div className="flex min-h-full max-h-full bg-zinc-900 text-white">
                <div className="flex-1 p-6 pb-20 space-y-6">
                    {isLoading || !ticket ? (
                        <div className="flex justify-center mt-32">
                            <ClipLoader color="#22d3ee" size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pb-4">
                                <div className="w-full lg:w-2/3">
                                    <div className="bg-zinc-800 rounded-2xl shadow-lg h-full p-6">
                                        <SupportTicketHeader
                                            title={ticket.title}
                                            creator={ticket.userName}
                                            category={ticket.category}
                                            supporters={ticket.supporterIds}
                                            allSupporters={allSupporters || []}
                                            status={ticket.status}
                                            onStatusChange={(newStatus) => updateTicket.mutate({
                                                ticketId: ticket.id,
                                                title: ticket.title,
                                                description: ticket.description,
                                                category: ticket.category,
                                                status: newStatus as TicketStatus
                                            })}
                                            onEdit={handleEditTicket}
                                            onDelete={handleDeleteTicket}
                                            availableCategories={categories || []}
                                            onCategoryChange={(newCategory) => updateTicket.mutate({
                                                ticketId: ticket.id,
                                                title: ticket.title,
                                                description: ticket.description,
                                                category: newCategory,
                                                status: ticket.status
                                            })}
                                            onAddSupporter={(id) => {
                                                if (!id) throw new Error("Die Supporter-ID ist nicht gültig: " + id)
                                                addSupporter({
                                                    ticketId: ticket.id,
                                                    supporterId: id
                                                })
                                            }}
                                            onRemoveSupporter={(id) => {
                                                if (!id) throw new Error("Die Supporter-ID ist nicht gültig: " + id)
                                                removeSupporter({
                                                    ticketId: ticket.id,
                                                    supporterId: id
                                                })
                                            }}
                                        />
                                        <div className={`my-4`}>
                                            <TicketDescription description={ticket.description} />
                                        </div>
                                        {ticket.chatId && (
                                            <div className={`border-t pt-4 border-zinc-700`}>
                                                {!username || !ticket.supporterNames.includes(username) ? (
                                                    <div className={`flex justify-center my-4`}>
                                                        Du musst diesem Ticket zugewiesen sein, um den Chat lesen zu können.
                                                    </div>
                                                ) : (
                                                    <TicketChatLink chatId={ticket.chatId} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col h-[calc(100vh-500px)]">
                                        <div className="bg-zinc-800 rounded-2xl shadow-lg flex-1 mt-6 overflow-hidden">
                                            <div className="flex flex-col h-full">
                                                <div className="text-xl font-semibold mb-4 flex flex-row items-center pl-4 pt-4">
                                                    <div className="mr-2 text-lg text-cyan-400">
                                                        <IoChatboxEllipsesOutline />
                                                    </div>
                                                    Ticket-Chat
                                                </div>

                                                <div className="flex-1 min-h-0 border-t border-zinc-700 px-4 py-4">
                                                    <TicketChatArea
                                                        chatId={ticket.id}
                                                        ticketId={ticket.id}
                                                        userType="SUPPORT"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="w-full lg:w-1/3">
                                    <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg h-full">
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-xl font-semibold">Notizen</h2>
                                            <button
                                                className="text-cyan-400 hover:text-cyan-300 font-medium"
                                                onClick={() => setNoteModalOpen(true)}
                                            >
                                                + Hinzufügen
                                            </button>
                                        </div>
                                        {notes?.length ? (
                                            notes.map((note) => (
                                                <TicketNoteComponent key={note.id} note={note} onDelete={handleDeleteNote} />
                                            ))
                                        ) : (
                                            <p className="text-zinc-400">Keine Notizen vorhanden.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
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

export default SupportTicketViewPage;