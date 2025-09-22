import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useLocalStorage } from 'usehooks-ts';

import { Drawer, Accordion } from '@mantine/core';

import { useNavigation } from '@/hooks/useNavigation';

import { paths } from '@/routes/paths';
import LogoImg from '@/assets/image/logo-white.svg';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

// export type INavModalProps = DrawerProps & {};

export type INavModalProps = {
  zIndex: string;
  opened: boolean;
  onClose: () => void;
};

const NavModal: FC<INavModalProps> = (props) => {
  const { opened, onClose, zIndex } = props;
  const router = useRouter();
  const [diamondCollectionReset, setDiamondCollectionReset] = useLocalStorage<boolean>(
    'diamondCollectionReset',
    false
  );
  const {
    labDiamondsMenu,
    inventoryMenu,
    readyToShipMenu,
    engagementRingsMenu,
    diamondCollectionsMenu,
    fineJewelryMenu,
  } = useNavigation();
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      zIndex={zIndex}
      className="mobile-drawer"
      size="100%"
      title={
        <Image
          src={LogoImg}
          style={{ color: 'white' }}
          width={40}
          height={40}
          alt="logo"
          onClick={() => {
            onClose();
            router.push(paths.home.root);
          }}
        />
      }
    >
      <Accordion variant="filled">
        {/* Lab Diamonds */}
        <Accordion.Item value={labDiamondsMenu.label}>
          <Accordion.Control>
            <Link href={labDiamondsMenu.link} onClick={onClose}>
              {labDiamondsMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
          <Accordion.Panel>
            {labDiamondsMenu.subMenu.map((m, idx) => (
              <Link key={idx} href={m.link} onClick={onClose} className="d-block">
                {m.label}
              </Link>
            ))}
          </Accordion.Panel>
        </Accordion.Item>

        {/* Inventory */}
        <Accordion.Item value={inventoryMenu.label}>
          <Accordion.Control chevron={<span />}>
            <Link href={inventoryMenu.link} onClick={onClose}>
              {inventoryMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
        </Accordion.Item>

        {/* Diamond Collections */}
        <Accordion.Item value={diamondCollectionsMenu.label}>
          <Accordion.Control>
            <Link href={diamondCollectionsMenu.link} onClick={onClose}>
              {diamondCollectionsMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion variant="filled">
              {[
                diamondCollectionsMenu.yourDiamondRing,
                diamondCollectionsMenu.shopByShape,
                diamondCollectionsMenu.shopByCarat,
              ].map((m, idx) => (
                <Accordion.Item key={idx} value={m.label}>
                  <Accordion.Control>{m.label}</Accordion.Control>
                  <Accordion.Panel>
                    {m.subMenu.map((sm, index) => (
                      <Link
                        href={sm.link}
                        onClick={() => {
                          onClose();
                          setDiamondCollectionReset(true);
                        }}
                        key={index}
                        className="d-block"
                      >
                        {sm.label}
                      </Link>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Engagement rings */}
        <Accordion.Item value={engagementRingsMenu.label}>
          <Accordion.Control>
            <Link href={engagementRingsMenu.link} onClick={onClose}>
              {engagementRingsMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion variant="filled">
              {[
                engagementRingsMenu.yourDiamondRing,
                engagementRingsMenu.shopByStyle,
                engagementRingsMenu.shopByShape,
                engagementRingsMenu.shopByMetal,
              ].map((m, idx) => (
                <Accordion.Item key={idx} value={m.label}>
                  <Accordion.Control>{m.label}</Accordion.Control>
                  <Accordion.Panel>
                    {m.subMenu.map((sm, index) => (
                      <Link
                        href={sm.link}
                        onClick={() => {
                          onClose();
                          setDiamondCollectionReset(true);
                        }}
                        key={index}
                        className="d-block"
                      >
                        {sm.label}
                      </Link>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Fine Jewelry */}
        <Accordion.Item value={fineJewelryMenu.label}>
          <Accordion.Control>
            <Link href={fineJewelryMenu.link} onClick={onClose}>
              {fineJewelryMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion variant="filled">
              {fineJewelryMenu.menuItems?.map((menuData, index) => (
                <Accordion.Item key={index} value={menuData.label}>
                  <Accordion.Control>
                    <Link href={`${menuData.link}`} onClick={onClose}>
                      {menuData.label}
                    </Link>
                  </Accordion.Control>
                  {menuData.subMenu?.map((subMenuData, idx) => (
                    <Accordion.Panel key={idx}>
                      <Link onClick={onClose} href={subMenuData.link} className="d-block">
                        {subMenuData.label}
                      </Link>
                    </Accordion.Panel>
                  ))}
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Education */}
        {/* <Accordion.Item value={educationMenu.label}>
          <Accordion.Control>
            <Link href={educationMenu.link}>{educationMenu.label}</Link>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion variant="filled">
              {[
                educationMenu.diamondMenu,
                educationMenu.diamondGuideMenu,
                educationMenu.helpfulGuidesMenu,
                educationMenu.ringCollectionMenu,
              ].map((m, index) => (
                <Accordion.Item key={index} value={m.label}>
                  <Accordion.Control>{m.label}</Accordion.Control>
                  <Accordion.Panel>
                    {m.subMenu.map((sm, idx) => (
                      <Link href={sm.link} key={idx} className="d-block">
                        {sm.label}
                      </Link>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item> */}

        {/* ready to ship  */}
        <Accordion.Item value={readyToShipMenu.label}>
          <Accordion.Control chevron={<span />}>
            <Link href={readyToShipMenu.link} onClick={onClose}>
              {readyToShipMenu.label?.toUpperCase()}
            </Link>
          </Accordion.Control>
        </Accordion.Item>
      </Accordion>
    </Drawer>
  );
};

export default NavModal;
