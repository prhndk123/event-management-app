import { useParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  ChevronLeft,
  Ticket,
  Tag,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { RatingStars } from "~/components/shared/rating-stars";
import { useEventStore } from "~/store/event-store";
import { useCartStore } from "~/store/cart-store";
import { useAuthStore } from "~/store/auth-store";
import { formatCurrency, formatDate, formatTime, TicketType } from "~/types";
import { mockReviews } from "~/data/mock-data";
import { toast } from "sonner";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const getEventById = useEventStore((state) => state.getEventById);
  const { addItem } = useCartStore();

  const event = getEventById(eventId || "");
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="container-wide py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button asChild>
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  const eventReviews = mockReviews.filter((r) => r.eventId === event.id);
  const isFree = event.price === 0;

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      toast.info("Please login to purchase tickets");
      navigate("/login");
      return;
    }

    if (!selectedTicket) {
      toast.error("Please select a ticket type");
      return;
    }

    addItem(event, selectedTicket, quantity);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/80 to-transparent" />

        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {event.category}
                </Badge>
                {isFree && (
                  <Badge className="bg-success text-success-foreground border-0">
                    Free Event
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              {/* Date & Location */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDate(event.startDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(event.startDate)} -{" "}
                      {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  About This Event
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Organizer */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Organized By
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                    />
                    <AvatarFallback>
                      {event.organizer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {event.organizer.name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        {event.organizer.rating}
                      </span>
                      <span>{event.organizer.totalEvents} events</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Reviews
                  </h2>
                  {eventReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <RatingStars rating={event.organizer.rating} showValue />
                      <span className="text-sm text-muted-foreground">
                        ({eventReviews.length} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {eventReviews.length > 0 ? (
                  <div className="space-y-4">
                    {eventReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.user.avatar}
                              alt={review.user.name}
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">
                              {review.user.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <RatingStars rating={review.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No reviews yet for this event.
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    {formatCurrency(event.price)}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.availableSeats} left</span>
                  </div>
                </div>

                {/* Voucher Info */}
                {event.vouchers.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 text-success text-sm font-medium">
                      <Tag className="h-4 w-4" />
                      Voucher Available
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use code{" "}
                      <span className="font-mono font-bold">
                        {event.vouchers[0].code}
                      </span>{" "}
                      for{" "}
                      {event.vouchers[0].discountType === "percentage"
                        ? `${event.vouchers[0].discountAmount}% off`
                        : formatCurrency(event.vouchers[0].discountAmount) +
                          " off"}
                    </p>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Ticket Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select Ticket
                    </label>
                    <Select
                      value={selectedTicket?.id || ""}
                      onValueChange={(value) => {
                        const ticket = event.ticketTypes.find(
                          (t) => t.id === value,
                        );
                        setSelectedTicket(ticket || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose ticket type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {event.ticketTypes.map((ticket) => (
                          <SelectItem key={ticket.id} value={ticket.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{ticket.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {formatCurrency(ticket.price)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedTicket && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedTicket.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Quantity
                    </label>
                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) => setQuantity(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Ticket" : "Tickets"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTicket && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(selectedTicket.price * quantity)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full btn-gradient"
                    size="lg"
                    onClick={handleBuyTicket}
                    disabled={event.availableSeats === 0}
                  >
                    <Ticket className="h-5 w-5 mr-2" />
                    {event.availableSeats === 0 ? "Sold Out" : "Get Tickets"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
