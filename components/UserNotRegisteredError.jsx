import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5EDE4] p-6">
      <div className="max-w-md w-full p-12 bg-white border border-black/10 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-[#FF5401]/10">
          <ShieldAlert className="w-10 h-10 text-[#FF5401]" />
        </div>
        
        <h1 className="text-3xl font-light text-black mb-4 tracking-tight">Access Restricted</h1>
        <p className="text-black/50 font-light mb-8 leading-relaxed">
          You are not currently authorized to access this section. Please contact the administrator to request the necessary permissions.
        </p>
        
        <div className="space-y-4">
          <Link href="/" passHref>
            <Button className="w-full bg-black hover:bg-[#FF5401] text-white rounded-none h-12 tracking-wider">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO HOME
            </Button>
          </Link>
          
          <div className="pt-8 border-t border-black/5">
            <p className="text-xs text-black/30 uppercase tracking-[0.2em] mb-4 text-left">Helpful steps</p>
            <ul className="text-left text-sm text-black/60 space-y-3 font-light">
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-[#FF5401] rounded-full mt-2" />
                Ensure you are logged in with the correct account.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-[#FF5401] rounded-full mt-2" />
                Contact the OffGrid team for role assignment.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 bg-[#FF5401] rounded-full mt-2" />
                Try clearing your session and logging back in.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
