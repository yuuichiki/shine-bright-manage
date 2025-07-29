import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import useApi from '@/hooks/useApi';

type HRStats = {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  recentAttendance: {
    employee_name: string;
    check_in: string;
    status: string;
  }[];
};

const HRWidget = () => {
  const { callApi } = useApi();
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    recentAttendance: []
  });

  useEffect(() => {
    fetchHRStats();
  }, []);

  const fetchHRStats = async () => {
    const data = await callApi<null, HRStats>({ url: '/hr/stats' });
    if (data) setStats(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Có mặt hôm nay</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.absentToday}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.lateToday}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Chấm công gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <div className="font-medium">{record.employee_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.check_in).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
                <Badge variant={record.status === 'on_time' ? 'default' : 'destructive'}>
                  {record.status === 'on_time' ? 'Đúng giờ' : 'Muộn'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRWidget;