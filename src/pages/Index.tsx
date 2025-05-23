
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, Settings, Image as ImageIcon, Text } from 'lucide-react';
import { Settings as SettingsDialog } from '@/components/Settings';
import { ImageDisplay } from '@/components/ImageDisplay';

interface GeneratedImage {
  url: string;
  prompt: string;
}

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const generatePrompt = async () => {
    if (!userInput.trim()) {
      toast.error('请输入一些文本描述');
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      const llmSettings = JSON.parse(localStorage.getItem('llmSettings') || '{}');
      
      if (!llmSettings.apiKey || !llmSettings.apiUrl || !llmSettings.model) {
        toast.error('请先在设置中配置LLM API');
        setShowSettings(true);
        return;
      }

      const systemPrompt = llmSettings.systemPrompt || `你是专业的封面设计师，把用户的输入，转化为一张专业的封面图的文本描述Prompt，直接输出Prompt给我：
the image ……`;

      const response = await fetch(llmSettings.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${llmSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: llmSettings.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          stream: false,
          max_tokens: 512,
          enable_thinking: false
        })
      });

      if (!response.ok) {
        throw new Error('Prompt生成失败');
      }

      const data = await response.json();
      const prompt = data.choices[0].message.content;
      setGeneratedPrompt(prompt);
      toast.success('Prompt生成成功！');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Prompt生成失败，请检查API设置');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const generateImage = async () => {
    if (!generatedPrompt.trim()) {
      toast.error('请先生成Prompt');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imageSettings = JSON.parse(localStorage.getItem('imageSettings') || '{}');
      
      if (!imageSettings.apiKey || !imageSettings.apiUrl || !imageSettings.model) {
        toast.error('请先在设置中配置图像生成API');
        setShowSettings(true);
        return;
      }

      const response = await fetch(imageSettings.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${imageSettings.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: imageSettings.model,
          prompt: generatedPrompt
        })
      });

      if (!response.ok) {
        throw new Error('图像生成失败');
      }

      const data = await response.json();
      const imageUrl = data.images[0].url;
      setGeneratedImage({
        url: imageUrl,
        prompt: generatedPrompt
      });
      toast.success('图像生成成功！');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('图像生成失败，请检查API设置');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `social-media-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('图片下载成功！');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('下载失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            AI 社交媒体图像生成器
          </h1>
          <p className="text-xl text-purple-100 mb-6">
            输入描述，AI 自动生成专业的社交媒体图片
          </p>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="mr-2 h-4 w-4" />
            API 设置
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Text className="mr-2 h-5 w-5" />
                  输入描述
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="例如：我们公司本周末有促销活动，50%折扣，想要一个吸引人的海报..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/60 resize-none"
                />
                <Button
                  onClick={generatePrompt}
                  disabled={isGeneratingPrompt || !userInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  {isGeneratingPrompt ? '生成中...' : '生成 AI Prompt'}
                </Button>
              </CardContent>
            </Card>

            {generatedPrompt && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">生成的 Prompt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="min-h-[100px] bg-white/5 border-white/20 text-white resize-none"
                  />
                  <Button
                    onClick={generateImage}
                    disabled={isGeneratingImage || !generatedPrompt.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
                  >
                    {isGeneratingImage ? '生成中...' : '生成图像'}
                    <ImageIcon className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    生成的图像
                  </span>
                  {generatedImage && (
                    <Button
                      onClick={downloadImage}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white border-0"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下载
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageDisplay 
                  image={generatedImage} 
                  isLoading={isGeneratingImage}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Index;
