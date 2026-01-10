"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Package,
  Ticket,
  DollarSign,
  Users,
  Check,
  X,
  Plus,
  Pencil,
  Trash2,
  FileText,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import MerchForm from "@/components/admin/MerchForm";
import BlogForm from "@/components/admin/BlogForm";
import EventForm from "@/components/admin/EventForm";
import { useToast } from "@/components/ui/toast";
import { ConfirmationModal } from "@/components/ui/modal";

export default function AdminDashboard() {
  const { data: session, status } = useSession({ required: true });
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null });

  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const isAdmin = session?.user?.role === "admin";

  React.useEffect(() => {
    // If fully loaded and not admin, kick them out
    if (status === "authenticated" && !isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, router]);

  // Ensure queries only run when we are authenticated as admin
  const isEnabled = status === "authenticated" && isAdmin;

  // Queries
  const { data: orders = [] } = useQuery({
    queryKey: ["all-orders"],
    queryFn: () => apiClient.entities.Order.list("-createdAt", 100),
    initialData: [],
    enabled: isEnabled,
  });

  const { data: reservations = [] } = useQuery({
    queryKey: ["all-reservations"],
    queryFn: () => apiClient.entities.Reservation.list("-createdAt", 100),
    initialData: [],
    enabled: isEnabled,
  });

  const { data: merchItems = [] } = useQuery({
    queryKey: ["admin-merch"],
    queryFn: () => apiClient.entities.Merch.list("-createdAt", 100),
    enabled: isEnabled && activeTab === "merch",
    initialData: [],
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: () => apiClient.entities.BlogPost.list("-createdAt", 100),
    enabled: isEnabled && activeTab === "blog",
    initialData: [],
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => apiClient.entities.Event.list("-date", 100),
    enabled: isEnabled && activeTab === "events",
    initialData: [],
  });

  // Mutations
  const updateReservationMutation = useMutation({
    mutationFn: ({ id, status }) =>
      apiClient.entities.Reservation.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
      toast({ title: "Success", description: "Reservation updated successfully", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "error" });
    }
  });

  const eventMutations = {
    create: useMutation({
      mutationFn: (data) => apiClient.entities.Event.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-events"] });
        setShowForm(false);
        toast({ title: "Success", description: "Event created successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }) => apiClient.entities.Event.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-events"] });
        setEditingItem(null);
        setShowForm(false);
        toast({ title: "Success", description: "Event updated successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    delete: useMutation({
      mutationFn: (id) => apiClient.entities.Event.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-events"] });
        toast({ title: "Success", description: "Event deleted successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
  };

  const merchMutations = {
    create: useMutation({
      mutationFn: (data) => apiClient.entities.Merch.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-merch"] });
        setShowForm(false);
        toast({ title: "Success", description: "Merch item created successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }) => apiClient.entities.Merch.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-merch"] });
        setEditingItem(null);
        setShowForm(false);
        toast({ title: "Success", description: "Merch item updated successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    delete: useMutation({
      mutationFn: (id) => apiClient.entities.Merch.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-merch"] });
        toast({ title: "Success", description: "Merch item deleted successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
  };

  const blogMutations = {
    create: useMutation({
      mutationFn: (data) => apiClient.entities.BlogPost.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
        setShowForm(false);
        toast({ title: "Success", description: "Blog post created successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    update: useMutation({
      mutationFn: ({ id, data }) =>
        apiClient.entities.BlogPost.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
        setEditingItem(null);
        setShowForm(false);
        toast({ title: "Success", description: "Blog post updated successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
    delete: useMutation({
      mutationFn: (id) => apiClient.entities.BlogPost.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
        toast({ title: "Success", description: "Blog post deleted successfully", variant: "success" });
      },
      onError: (error) => toast({ title: "Error", description: error.message, variant: "error" }),
    }),
  };

  const handleFormSubmit = (data) => {
    if (activeTab === "merch") {
      if (editingItem)
        merchMutations.update.mutate({ id: editingItem.id, data });
      else merchMutations.create.mutate(data);
    } else if (activeTab === "blog") {
      if (editingItem)
        blogMutations.update.mutate({ id: editingItem.id, data });
      else blogMutations.create.mutate(data);
    } else if (activeTab === "events") {
      if (editingItem)
        eventMutations.update.mutate({ id: editingItem.id, data });
      else eventMutations.create.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, type: activeTab, id });
  };

  const handleConfirmDelete = () => {
    const { type, id } = confirmModal;
    if (type === "merch") merchMutations.delete.mutate(id);
    else if (type === "blog") blogMutations.delete.mutate(id);
    else if (type === "events") eventMutations.delete.mutate(id);
    setConfirmModal({ isOpen: false, type: null, id: null });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Derived Stats
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingReservations = reservations.filter(
    (r) => r.status === "pending",
  ).length;

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDE4]">
        <div className="w-8 h-8 border-2 border-[#FF5401] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null; // Will redirect via useEffect

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "orders", label: "Orders", icon: Package },
    { id: "reservations", label: "Reservations", icon: Ticket },
    { id: "events", label: "Events", icon: Calendar },
    { id: "merch", label: "Merchandise", icon: ShoppingBag },
    { id: "blog", label: "Blog Posts", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F5EDE4] text-black flex flex-col md:flex-row">
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-black/10 md:min-h-screen">
        <div className="p-6 border-b border-black/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-black/60 hover:text-[#FF5401] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
          <h1 className="text-xl fontlight text-[#FF5401]">Admin Dashboard</h1>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-light transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-extralight mb-8">Overview</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-black/10 p-6">
                <p className="text-xs text-black/40 tracking-wider mb-2">
                  REVENUE
                </p>
                <p className="text-3xl font-light">
                  ₦{totalRevenue.toFixed(0)}
                </p>
              </div>
              <div className="bg-white border border-black/10 p-6">
                <p className="text-xs text-black/40 tracking-wider mb-2">
                  ORDERS
                </p>
                <p className="text-3xl font-light">{orders.length}</p>
              </div>
              <div className="bg-white border border-black/10 p-6">
                <p className="text-xs text-black/40 tracking-wider mb-2">
                  RESERVATIONS
                </p>
                <p className="text-3xl font-light">{reservations.length}</p>
              </div>
              <div className="bg-white border border-black/10 p-6">
                <p className="text-xs text-black/40 tracking-wider mb-2">
                  PENDING ACTIONS
                </p>
                <p className="text-3xl font-light text-[#FF5401]">
                  {pendingOrders + pendingReservations}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-extralight mb-8">Orders</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-black/50">No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-black/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {order.customer_email}
                      </p>
                      <p className="text-xs text-black/50">
                        {format(new Date(order.createdAt), "MMM d, yyyy")} •{" "}
                        {order.items.length} items
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-light">
                        ₦{order.total_amount.toFixed(2)}
                      </p>
                      <span
                        className={`px-3 py-1 text-xs ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Reservations Tab */}
        {activeTab === "reservations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-extralight mb-8">Reservations</h2>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <p className="text-black/50">No reservations found.</p>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white border border-black/10 p-6 grid md:grid-cols-4 gap-4 items-center"
                  >
                    <div>
                      <p className="font-medium">{res.name}</p>
                      <p className="text-xs text-black/50">{res.role}</p>
                    </div>
                    <div className="text-sm">
                      {res.seats} Table{res.seats > 1 ? "s" : ""}
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 text-xs inline-block ${
                          res.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : res.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      {res.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="h-8 bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              updateReservationMutation.mutate({
                                id: res.id,
                                status: "confirmed",
                              })
                            }
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              updateReservationMutation.mutate({
                                id: res.id,
                                status: "cancelled",
                              })
                            }
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extralight">Events</h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-black hover:bg-[#FF5401] rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <div className="mb-8">
                  <EventForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={
                      eventMutations.create.isPending ||
                      eventMutations.update.isPending
                    }
                    onCancel={handleCancel}
                    initialData={editingItem}
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-black/10 p-4 group hover:border-[#FF5401] transition-colors"
                >
                  <div className="relative aspect-video mb-4 bg-black/5 overflow-hidden">
                    {event.cover_image && (
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-light truncate text-lg">{event.title}</h3>
                  <div className="text-xs text-black/50 mb-2">
                     {format(new Date(event.date), "MMM d, yyyy")} • {event.time}
                  </div>
                  <div className="flex justify-between text-sm text-black/60 pt-2 border-t border-black/5">
                    <span>{event.venue}</span>
                    <span className={event.status === "upcoming" ? "text-green-600" : "text-black/40"}>
                        {event.status.toUpperCase()}
                    </span>
                  </div>
                   <div className="text-xs text-black/40 mt-2">
                      {event.seats_taken} / {event.total_seats} Tables Booked
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Merch Tab */}
        {activeTab === "merch" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extralight">Merchandise</h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-black hover:bg-[#FF5401] rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <div className="mb-8">
                  <MerchForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={
                      merchMutations.create.isPending ||
                      merchMutations.update.isPending
                    }
                    onCancel={handleCancel}
                    initialData={editingItem}
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-black/10 p-4 group hover:border-[#FF5401] transition-colors"
                >
                  <div className="relative aspect-square mb-4 bg-black/5">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-light truncate">{item.name}</h3>
                  <div className="flex justify-between text-sm text-black/60 mt-1">
                    <span>₦{item.price}</span>
                    <span>Stock: {item.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extralight">Blog Posts</h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-black hover:bg-[#FF5401] rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" /> New Post
              </Button>
            </div>

            <AnimatePresence>
              {showForm && (
                <div className="mb-8">
                  <BlogForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={
                      blogMutations.create.isPending ||
                      blogMutations.update.isPending
                    }
                    onCancel={handleCancel}
                    initialData={editingItem}
                  />
                </div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-black/10 p-6 flex flex-col md:flex-row gap-6 group hover:border-[#FF5401] transition-colors"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-24 h-24 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-light">{post.title}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 border ${post.status === "published" ? "border-green-500 text-green-600" : "border-black/20 text-black/40"}`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-black/50 line-clamp-2 mb-2">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-black/30">
                      {format(new Date(post.createdAt), "MMM d, yyyy")} •{" "}
                      {post.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
