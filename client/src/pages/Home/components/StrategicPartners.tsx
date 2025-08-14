import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PartnersSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;

 
`;

const PartnersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
`;

const PartnersTitle = styled.h2`
  font-size: 2.8rem;
  color: rgb(58, 61, 108);
  margin-bottom: 3rem;
  font-weight: bold;
  position: relative;
  display: inline-block;
  padding-bottom: 15px;


`;

const PartnersGrid = styled.div`

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  column-gap:0;
  justify-items: center;
  align-items: center;
  margin: 2rem 0;
  display: flex
;
    flex-wrap: wrap;
    gap: 4rem;
    justify-content: center;
    align-items: center;

  @media (max-width: 450px) {
   display: grid;
   gap:0.6rem;
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PartnerCard = styled.div`
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 0.5px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  height: 280px;
  max-width: 280px;
  min-width: 280px;
  min-height: 280px;
  max-height: 280px;
  justify-content: center;
  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  }
  @media (max-width: 600px) {
    width: 140px;
    height: 140px;
    max-width: 170px;
    min-width: 170px;
    min-height: 170px;
    max-height: 170px;
  }
`;

const PartnerLogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: #3A3D6C;
  border-radius: 50%;
      border: 2px solid #3A3D6C;
  overflow: hidden;
`;

const PartnerLogo = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
  display: block;
  border-radius: 50%;
  background: white;
`;

const PartnerName = styled.div`
  font-size: 1.2rem;
  color: #3a3d6c;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
`;

const PartnerSub = styled.div`
  font-size: 1rem;
  color: #666;
  text-align: center;
`;

const PartnersDescription = styled.p`
display: flex
;
    flex-wrap: wrap;
    gap: 4rem;
    justify-content: center;
    align-items: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ContributorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: center;
  margin: 2rem 0;
  
`;

const ContributorCard = styled.div`
  border-radius:50%;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  padding: 1.5rem 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 140px;
  
  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    border-color: #bfa76a;
  }
`;

const ContributorImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  
`;

const NoImagePartnersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: center;
  margin: 2rem 0 0 0;
`;

const NoImagePartnerCard = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3A3D6C;
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  border: 2px solid #3A3D6C;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-6px) scale(1.04);
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
  }

  @media (max-width: 600px) {
    width: 140px;
    height: 140px;
    max-width: 170px;
    min-width: 170px;
    min-height: 170px;
    max-height: 170px;
    font-size: 0.95rem;
  }
`;

const partners = [
  {
    logo: '/contributer/card1.jpg',
    name: 'الهيئة العامة للأوقاف',
  },
  {
    logo: '/contributer/card2.webp',
    name: 'البنك الإسلامي',
  },
  {
    logo: '/contributer/card3.jpg',
    name: 'جمعية لغاد لأوقوفة',
  },
  {
    logo: '/contributer/card4.png',
    name: 'مجموعة العطير',
  },
  {
    logo: '/contributer/card5.jpg',
    name: 'العين الأندلس',
  },
  {
    logo: '/contributer/card6.jpg',
    name: 'إحسان الوقفية',
  },
  {
    logo: '/contributer/card7.webp',
    name: 'مؤسسة بوعود',
  },
  {
    logo: '/contributer/maher.jpg',
    name: 'شركة ماهر',
  },
  {
    logo: '/contributer/ehsan.JPG',
    name: 'مبرة إحسان الوقفية',
  },
  {
    logo: '/contributer/wakf.jpg',
    name: '  وقف السند',
  },
];

const noImagePartners: string[] = [
  
  // 'بابطين للحلويات',
  // 'مؤسسة حسن عويد للمواشي',
  // 'مؤسسة سليمان بن محمد النملة الخيرية',
];

const allPartners = [
  ...partners,
  ...noImagePartners.map((name: string): { name: string; noImage: true } => ({ name, noImage: true })),
];

const StrategicPartners: React.FC = () => {
  return (
   <div  className='items-center ' style={{direction:'rtl'}}>
    <PartnersSection>
      <PartnersContainer>
        <PartnersTitle className='my-section-title' >   شركاؤنا </PartnersTitle>
        <PartnersGrid>
          {allPartners.map((partner, idx) => (
            'logo' in partner ? (
              <PartnerCard key={partner.name}>
                <PartnerLogoWrapper>
                  <PartnerLogo
                  className='md:!w-[250px] !w-[156px] !h-[130px] md:!h-[220px] !rounded-none object-contain '
                  loading='lazy'
                    src={partner.logo}
                    alt={partner.name}
                  />
                </PartnerLogoWrapper>
              </PartnerCard>
            ) : (
              <NoImagePartnerCard key={partner.name}>{partner.name}</NoImagePartnerCard>
            )
          ))}
        </PartnersGrid>
      </PartnersContainer>
      <PartnersContainer>
      
        <PartnersDescription className='!text-lg pt-5'>
          نعتز بمساهمات شركائنا الذين كان لهم دور بارز في دعم مسيرتنا وتحقيق أهدافنا المجتمعية.
        </PartnersDescription>
      </PartnersContainer>
    </PartnersSection></div>
  );
};

export default StrategicPartners;
