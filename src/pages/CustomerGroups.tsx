import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, UserPlus, UserMinus, FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import useApi from '@/hooks/useApi';
import { generateCustomerGroupReport } from '@/utils/pdfGenerator';

type CustomerGroup = {
  id: number;
  name: string;
  description: string;
  criteria: string;
  member_count: number;
  created_at: string;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  assigned_date?: string;
};

const CustomerGroups = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [groupMembers, setGroupMembers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Partial<CustomerGroup>>({});
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchCustomers();
  }, []);

  const fetchGroups = async () => {
    const data = await callApi<null, CustomerGroup[]>({ url: '/customer-groups' });
    if (data) setGroups(data);
  };

  const fetchCustomers = async () => {
    const data = await callApi<null, Customer[]>({ url: '/customers' });
    if (data) setCustomers(data);
  };

  const fetchGroupMembers = async (groupId: number) => {
    const data = await callApi<null, Customer[]>({ url: `/customer-groups/${groupId}/members` });
    if (data) setGroupMembers(data);
  };

  const handleSaveGroup = async () => {
    if (!editingGroup.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập tên nhóm.",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      const success = await callApi({
        url: `/customer-groups/${editingGroup.id}`,
        method: 'PUT',
        body: editingGroup
      });
      if (success) {
        toast({ title: "Đã cập nhật nhóm khách hàng" });
        fetchGroups();
      }
    } else {
      const data = await callApi<Partial<CustomerGroup>, CustomerGroup>({
        url: '/customer-groups',
        method: 'POST',
        body: editingGroup
      });
      if (data) {
        toast({ title: "Đã tạo nhóm khách hàng mới" });
        fetchGroups();
      }
    }

    setIsDialogOpen(false);
    setEditingGroup({});
    setIsEditing(false);
  };

  const handleEdit = (group: CustomerGroup) => {
    setEditingGroup(group);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await callApi({ url: `/customer-groups/${id}`, method: 'DELETE' });
    if (success) {
      toast({ title: "Đã xóa nhóm khách hàng" });
      fetchGroups();
    }
  };

  const handleManageMembers = (group: CustomerGroup) => {
    setSelectedGroup(group);
    fetchGroupMembers(group.id);
    setIsMemberDialogOpen(true);
  };

  const addMemberToGroup = async (customerId: number) => {
    if (!selectedGroup) return;
    
    const success = await callApi({
      url: `/customer-groups/${selectedGroup.id}/members`,
      method: 'POST',
      body: { customer_id: customerId }
    });
    
    if (success) {
      toast({ title: "Đã thêm khách hàng vào nhóm" });
      fetchGroupMembers(selectedGroup.id);
      fetchGroups();
    }
  };

  const removeMemberFromGroup = async (customerId: number) => {
    if (!selectedGroup) return;
    
    const success = await callApi({
      url: `/customer-groups/${selectedGroup.id}/members/${customerId}`,
      method: 'DELETE'
    });
    
    if (success) {
      toast({ title: "Đã xóa khách hàng khỏi nhóm" });
      fetchGroupMembers(selectedGroup.id);
      fetchGroups();
    }
  };

  const exportReport = () => {
    generateCustomerGroupReport(groups);
    toast({ title: "Đã xuất báo cáo" });
  };

  const availableCustomers = customers.filter(
    customer => !groupMembers.find(member => member.id === customer.id)
  );

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Nhóm Khách Hàng</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh Sách Nhóm Khách Hàng</CardTitle>
              <div className="flex gap-2">
                <Button onClick={exportReport} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Xuất báo cáo
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm Nhóm
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{isEditing ? 'Sửa Nhóm Khách Hàng' : 'Thêm Nhóm Khách Hàng'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <label className="text-sm font-medium">Tên nhóm *</label>
                        <Input
                          value={editingGroup.name || ''}
                          onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                          placeholder="Nhập tên nhóm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mô tả</label>
                        <Textarea
                          value={editingGroup.description || ''}
                          onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                          placeholder="Mô tả nhóm khách hàng"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tiêu chí phân nhóm</label>
                        <Textarea
                          value={editingGroup.criteria || ''}
                          onChange={(e) => setEditingGroup({...editingGroup, criteria: e.target.value})}
                          placeholder="Ví dụ: Khách hàng mua hàng > 10 triệu/tháng"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSaveGroup} disabled={loading}>
                          {isEditing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Tiêu chí</TableHead>
                  <TableHead>Số thành viên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>{group.criteria}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{group.member_count} thành viên</Badge>
                    </TableCell>
                    <TableCell>{new Date(group.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleManageMembers(group)}>
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(group)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(group.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Member Management Dialog */}
        <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Quản lý thành viên: {selectedGroup?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              {/* Current Members */}
              <div>
                <h3 className="font-medium mb-3">Thành viên hiện tại ({groupMembers.length})</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.phone}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeMemberFromGroup(member.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {groupMembers.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Chưa có thành viên nào
                    </div>
                  )}
                </div>
              </div>

              {/* Available Customers */}
              <div>
                <h3 className="font-medium mb-3">Khách hàng khả dụng ({availableCustomers.length})</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {availableCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addMemberToGroup(customer.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {availableCustomers.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      Tất cả khách hàng đã trong nhóm
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CustomerGroups;