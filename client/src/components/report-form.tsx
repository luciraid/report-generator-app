import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertWorkshopReportSchema, type InsertWorkshopReport } from "@shared/schema";
import { useLocation } from "wouter";

export default function ReportForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertWorkshopReport>({
    resolver: zodResolver(insertWorkshopReportSchema),
    defaultValues: {
      dateOfManufacture: "",
      incomingPartNumber: "",
      incomingSerialNumber: "",
      outgoingPartNumber: "",
      outgoingSerialNumber: "",
      modificationStatus: "",
      reasonForShopVisit: "",
      shopExitReason: "",
      findings: "",
      actionsTaken: "",
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: InsertWorkshopReport) => {
      const response = await apiRequest("POST", "/api/reports", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Report created successfully",
        description: "The workshop report has been saved.",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWorkshopReport) => {
    createReportMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold" data-testid="text-form-title">New Workshop Report</h3>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="dateOfManufacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Manufacture (DMF)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-dmf" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="incomingPartNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoming Part Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter incoming part number" {...field} data-testid="input-incoming-part" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incomingSerialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoming Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter incoming serial number" {...field} data-testid="input-incoming-serial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="outgoingPartNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outgoing Part Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter outgoing part number" {...field} data-testid="input-outgoing-part" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="outgoingSerialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outgoing Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter outgoing serial number" {...field} data-testid="input-outgoing-serial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="modificationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modification Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-modification-status">
                          <SelectValue placeholder="Select modification status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no-modification">No Modification</SelectItem>
                        <SelectItem value="minor-modification">Minor Modification</SelectItem>
                        <SelectItem value="major-modification">Major Modification</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reasonForShopVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Shop Visit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-visit-reason">
                          <SelectValue placeholder="Select reason for visit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled-maintenance">Scheduled Maintenance</SelectItem>
                        <SelectItem value="unscheduled-repair">Unscheduled Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="overhaul">Overhaul</SelectItem>
                        <SelectItem value="modification">Modification</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Details</FormLabel>
                      <FormControl>
                        <Textarea
                        placeholder="Enter any extra details (optional)"
                        className="resize-vertical"
                        rows={3}
                        {...field}
                        data-testid="textarea-other-details"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="findings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Findings</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter findings" 
                        className="resize-vertical" 
                        rows={4} 
                        {...field} 
                        data-testid="textarea-findings"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actionsTaken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actions Taken</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter actions taken" 
                        className="resize-vertical" 
                        rows={4} 
                        {...field} 
                        data-testid="textarea-actions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shopExitReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Exit Reason</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-exit-reason">
                          <SelectValue placeholder="Select exit reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="repair-completed">Repair Completed</SelectItem>
                        <SelectItem value="maintenance-completed">Maintenance Completed</SelectItem>
                        <SelectItem value="inspection-completed">Inspection Completed</SelectItem>
                        <SelectItem value="no-defect-found">No Defect Found</SelectItem>
                        <SelectItem value="beyond-repair">Beyond Repair</SelectItem>
                        <SelectItem value="awaiting-parts">Awaiting Parts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createReportMutation.isPending}
                  data-testid="button-submit"
                >
                  {createReportMutation.isPending ? "Saving..." : "Save Report"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}