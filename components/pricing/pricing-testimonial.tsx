import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { testimonials } from "@/const/pricing"


export function PricingTestimonials() {
  return (
    <div className="w-full mt-12">
      <h3 className="text-xl font-bold text-center mb-6">What Our Customers Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.content + testimonial.author.name} className={cn("h-full", index === 1 ? "border-primary shadow-md" : "")}>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={testimonial.author.avatar || "/placeholder.svg"} alt={testimonial.author.name} />
                  <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{testimonial.author.name}</p>
                  <p className="text-xs text-gray-500">
                    {testimonial.author.role}, {testimonial.author.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
