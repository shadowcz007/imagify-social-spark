
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LLMSettings {
  apiKey: string;
  apiUrl: string;
  model: string;
  systemPrompt: string;
}

interface ImageSettings {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export const Settings: React.FC<SettingsProps> = ({ open, onOpenChange }) => {
  const [llmSettings, setLlmSettings] = useState<LLMSettings>({
    apiKey: '',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    systemPrompt: `你是专业的封面设计师，把用户的输入，转化为一张专业的封面图的文本描述Prompt，直接输出Prompt给我：
the image should be professional, eye-catching, and suitable for social media posting. Include specific visual elements, colors, and style descriptions.`
  });

  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    apiKey: '',
    apiUrl: 'https://api.siliconflow.cn/v1/images/generations',
    model: 'Kwai-Kolors/Kolors'
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedLlmSettings = localStorage.getItem('llmSettings');
    const savedImageSettings = localStorage.getItem('imageSettings');

    if (savedLlmSettings) {
      setLlmSettings(JSON.parse(savedLlmSettings));
    }

    if (savedImageSettings) {
      setImageSettings(JSON.parse(savedImageSettings));
    }
  }, []);

  const saveLlmSettings = () => {
    localStorage.setItem('llmSettings', JSON.stringify(llmSettings));
    toast.success('LLM设置已保存');
  };

  const saveImageSettings = () => {
    localStorage.setItem('imageSettings', JSON.stringify(imageSettings));
    toast.success('图像生成设置已保存');
  };

  const saveAllSettings = () => {
    saveLlmSettings();
    saveImageSettings();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API 设置</DialogTitle>
          <DialogDescription>
            配置LLM和图像生成API的相关参数
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="llm" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="llm">LLM API</TabsTrigger>
            <TabsTrigger value="image">图像生成 API</TabsTrigger>
          </TabsList>

          <TabsContent value="llm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LLM API 配置</CardTitle>
                <CardDescription>
                  用于将用户输入转换为优化的图像生成Prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="llm-api-key">API Key</Label>
                  <Input
                    id="llm-api-key"
                    type="password"
                    placeholder="输入您的API Key"
                    value={llmSettings.apiKey}
                    onChange={(e) => setLlmSettings({ ...llmSettings, apiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="llm-api-url">API URL</Label>
                  <Input
                    id="llm-api-url"
                    placeholder="https://api.siliconflow.cn/v1/chat/completions"
                    value={llmSettings.apiUrl}
                    onChange={(e) => setLlmSettings({ ...llmSettings, apiUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="llm-model">模型</Label>
                  <Input
                    id="llm-model"
                    placeholder="Qwen/Qwen2.5-7B-Instruct"
                    value={llmSettings.model}
                    onChange={(e) => setLlmSettings({ ...llmSettings, model: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    className="min-h-[120px] resize-none"
                    placeholder="输入系统提示词..."
                    value={llmSettings.systemPrompt}
                    onChange={(e) => setLlmSettings({ ...llmSettings, systemPrompt: e.target.value })}
                  />
                </div>

                <Button onClick={saveLlmSettings} className="w-full">
                  保存 LLM 设置
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>图像生成 API 配置</CardTitle>
                <CardDescription>
                  用于根据Prompt生成图像
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-api-key">API Key</Label>
                  <Input
                    id="image-api-key"
                    type="password"
                    placeholder="输入您的API Key"
                    value={imageSettings.apiKey}
                    onChange={(e) => setImageSettings({ ...imageSettings, apiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-api-url">API URL</Label>
                  <Input
                    id="image-api-url"
                    placeholder="https://api.siliconflow.cn/v1/images/generations"
                    value={imageSettings.apiUrl}
                    onChange={(e) => setImageSettings({ ...imageSettings, apiUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-model">模型</Label>
                  <Input
                    id="image-model"
                    placeholder="Kwai-Kolors/Kolors"
                    value={imageSettings.model}
                    onChange={(e) => setImageSettings({ ...imageSettings, model: e.target.value })}
                  />
                </div>

                <Button onClick={saveImageSettings} className="w-full">
                  保存图像生成设置
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={saveAllSettings}>
            保存所有设置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
