import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addTransaction, updateTransaction } from '../db/db';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, X, Upload } from 'lucide-react';
import Icon from '../components/Icon';

const AddTransaction: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form state
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Fetch categories
  const categories = useLiveQuery(
    () => db.categories.where('type').equals(type).toArray(),
    [type]
  );
  
  // Fetch transaction if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchTransaction = async () => {
        const transaction = await db.transactions.get(Number(id));
        
        if (transaction) {
          setType(transaction.type);
          setAmount(transaction.amount.toString());
          setCategoryId(transaction.category);
          setDate(transaction.date.split('T')[0]);
          setDescription(transaction.description);
          setNotes(transaction.notes || '');
          setReceiptImage(transaction.receiptImage);
          setPaymentMethod(transaction.paymentMethod || '');
        } else {
          navigate('/transactions');
        }
      };
      
      fetchTransaction();
    }
  }, [id, isEditMode, navigate]);
  
  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };
  
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      setReceiptImage(imageData);
      
      stopCamera();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setReceiptImage(event.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      alert('Please select a category');
      return;
    }
    
    setLoading(true);
    
    try {
      const transactionData = {
        type,
        amount: parseFloat(amount),
        category: categoryId,
        date: new Date(date).toISOString(),
        description,
        notes: notes || undefined,
        receiptImage: receiptImage || undefined,
        paymentMethod: paymentMethod || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (isEditMode && id) {
        await updateTransaction(Number(id), transactionData);
      } else {
        await addTransaction(transactionData);
      }
      
      navigate('/transactions');
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm mb-6">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'expense'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'income'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Income
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {categories?.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  categoryId === category.id
                    ? `border-2 border-${type === 'income' ? 'green' : 'red'}-500`
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <Icon 
                    name={category.icon} 
                    className="h-5 w-5" 
                    color={category.color} 
                  />
                </div>
                <span className="text-xs text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method (Optional)</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Cash, Credit Card, etc."
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details..."
            rows={3}
            className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Receipt (Optional)</label>
          {!receiptImage ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span>Take Photo</span>
              </button>
              
              <label className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <Upload className="h-5 w-5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={receiptImage} 
                alt="Receipt" 
                className="w-full h-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => setReceiptImage(undefined)}
                className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
      
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button 
              type="button" 
              onClick={stopCamera}
              className="text-white"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={captureImage}
              className="bg-white text-black px-4 py-2 rounded-full"
            >
              Capture
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="max-h-full max-w-full"
            />
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default AddTransaction;